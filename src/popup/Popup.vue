<script setup lang="ts">
import type { TabPaneName } from 'element-plus'
import { ElButton, ElMessage, ElMessageBox, ElTabPane, ElTabs } from 'element-plus'
import { useClipboard } from '@vueuse/core'
import { onMessage, sendMessage } from 'webext-bridge'
// import TableReward from '../components/TableReward.vue'
import { storageComments as storageDemo } from '~/logic/storage'

async function copyComment(comment: string) {
  // 获取当前页面up名
  browser.tabs.query({ active: true, currentWindow: true }).then(async (tabs) => {
    const tab = tabs[0]
    await sendMessage('getTextFromPopup', { title: tab.title, tabId: tab.id! }, { context: 'content-script', tabId: tab.id! })
    onMessage('sendUpName', (res) => {
      const upName: string = (res.data as any).upName
      const replacedComment = comment.replace('XX', upName)
      const { copy } = useClipboard({ source: replacedComment })
      copy()
    })
  })
}

function addComment(children) {
  ElMessageBox.prompt('Please input your 评论', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',

  })
    .then(({ value }) => {
      children.push({ comment: value })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}

const editableTabsValue = ref('2')
let tabIndex = 2
const handleTabsEdit = (targetName: TabPaneName, action: 'remove' | 'add') => {
  if (action === 'add') {
    const newTabName = `${++tabIndex}`
    ElMessageBox.prompt('Please input your 分组名称', 'Tip', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',

    })
      .then(({ value }) => {
        storageDemo.value.push({
          tabName: value,
          children: [],
        })
        editableTabsValue.value = newTabName
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Input canceled',
        })
      })
  }
  else if (action === 'remove') {
    storageDemo.value.pop()
    const tabs = storageDemo.value
    let activeName = editableTabsValue.value
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.tabName === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab)
            activeName = nextTab.tabName
        }
      })
    }

    editableTabsValue.value = activeName

    // storageDemo.value.splice(3, 1)
    // storageDemo.value = tabs.filter(tab => tab.tabName !== targetName)
  }
}

const removeTab = (targetName: string) => {
  console.log('remove')

  const tabs = storageDemo.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.tabName === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab)
          activeName = nextTab.tabName
      }
    })
  }

  editableTabsValue.value = activeName
  storageDemo.value = tabs.filter(tab => tab.tabName !== targetName)
}
</script>

<template>
  <main class="w-[800px] h-[400px] px-4 py-5  ">
    <ElTabs v-model="editableTabsValue" editable type="card" @edit="handleTabsEdit" @tab-remove="removeTab">
      <ElTabPane v-for="item in storageDemo" :key="item.tabName" :label="item.tabName">
        <!-- <TableReward v-model="tableData" :default-row="{ comment: '' }" /> -->
        <div v-for="subItem in item.children" :key="subItem.comment" class=" white ">
          <p class="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {{ subItem.comment }}  <button class="btn " @click="copyComment(subItem.comment)">
              复制
            </button>
            <button class="btn bg-red-500" @click="copyComment(subItem.comment)">
              删除
            </button>
          </p>
        </div>
        <button class="btn mt-2" @click="addComment(item.children)">
          添加评论
        </button>
      </ElTabPane>
    </ElTabs>
  </main>
</template>

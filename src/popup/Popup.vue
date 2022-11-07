<script setup lang="ts">
import type { TabPaneName } from 'element-plus'
import { ElMessage, ElMessageBox, ElTabPane, ElTabs, ElTooltip } from 'element-plus'
import { useClipboard } from '@vueuse/core'
import { onMessage, sendMessage } from 'webext-bridge'
import { storageComments as storageDemo } from '~/logic/storage'

async function copyComment(comment: string) {
  // 获取当前页面up名
  browser.tabs.query({ active: true, currentWindow: true }).then(async (tabs) => {
    const tab = tabs[0]
    await sendMessage('getTextFromPopup', { title: tab.title, tabId: tab.id! }, { context: 'content-script', tabId: tab.id! })
  })
  onMessage('sendUpName', (res) => {
    const upName: string = (res.data as any).upName
    const replacedComment = comment.replace('XX', upName)
    const { copy } = useClipboard({ source: replacedComment })
    copy()
    ElMessage.warning({ message: `复制成功-----${replacedComment}`, duration: 2000 })
  })
}

function addComment(children: any[]) {
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
function deleteComment(children: any[], cIndex: number) {
  ElMessageBox.confirm(' 确认删除？', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  })
    .then(() => {
      children.splice(cIndex, 1)
    })
    .catch(() => {

    })
}
const editableTabsValue = ref('土味情话')
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
  }
}
</script>

<template>
  <main class="w-[800px] h-[400px] overflow-scroll px-4 py-5">
    <!-- <el-input v-mdeol="" /> -->
    <ElTabs v-model="editableTabsValue" editable type="border-card" @edit="handleTabsEdit">
      <ElTabPane v-for="(item) in storageDemo" :key="item.tabName" :label="item.tabName" :name="item.tabName">
        <div v-for="(subItem, subIndex) in item.children" :key="subItem.comment" class="flex items-center py-1">
          <el-tooltip
            effect="dark"
            :content="subItem.comment"
            placement="bottom-end"
          >
            <span class="max-w-[650px]  inline-block overflow-hidden overflow-ellipsis whitespace-nowrap"> {{ subIndex + 1 }}:  {{ subItem.comment }}</span>
          </el-tooltip>
          <button class="btn mx-1" @click="copyComment(subItem.comment)">
            复制
          </button>
          <button class="btn bg-red-500" @click="deleteComment(item.children, subIndex)">
            删除
          </button>
        </div>
        <button class="btn mt-2" @click="addComment(item.children)">
          添加评论
        </button>
      </ElTabPane>
    </ElTabs>
  </main>
</template>

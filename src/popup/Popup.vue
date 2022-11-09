<script setup lang="ts">
import type { TabPaneName } from 'element-plus'
import { ElInput, ElMessage, ElMessageBox, ElTabPane, ElTabs, ElTooltip } from 'element-plus'
import { useClipboard } from '@vueuse/core'
import { onMessage, sendMessage } from 'webext-bridge'
import emojiJson from '../assets/emoji.json'
import { storageComments as storageDemo } from '~/logic/storage'
const emoteList = emojiJson.data.packages.map(item => item.emote).flat()
// console.log(emoteList)

function transformEmoji(comment: string) {
  // 替换emoji
  console.log(comment)
  // const needTransform2EmojiString = comment.match(/^[.*]$/g)
  // 以[开头，碰见第一个]
  const regex = /\[(\w)*|(\u{hhhh})*\]/gimu
  const commentMatchList = comment.match(regex)
  console.log(commentMatchList)

  // function findPic(matchStr: string) {
  //   console.log(matchStr)
  // }
  // const replacedComment = comment.replace(/^([.*])$/, findPic('$&'))

  // <img src={findPic($1)}></img>
  return comment
}
transformEmoji(`XX，我把我的心取出来给你
            [哈欠]→[抓狂]→[给心心]
            我还能把它放回去
            [给心心]→[偷笑]→[害羞]
            我再给你演示一遍
            [哈欠]→[抓狂]→[抓狂]→[抓狂]
            咦，我的心呢[难过]
            原来是你把我的心偷走了[大哭]`)

async function copyComment(comment: string) {
  // 获取当前页面的id并发送请求
  browser.tabs.query({ active: true, currentWindow: true }).then(async (tabs) => {
    const tab = tabs[0]
    await sendMessage('getUpName', { title: tab.title, tabId: tab.id! }, { context: 'content-script', tabId: tab.id! })
  })
  onMessage('sendUpName', (res) => {
    // 接受到当前up的名称
    const upName: string = (res.data as any)?.upName
    const replacedComment = comment.replace('XX', upName)
    const { copy } = useClipboard({ source: replacedComment })
    copy()
    if (upName)
      ElMessage.warning({ message: `复制成功-----${replacedComment}`, duration: 2000 })
    else
      ElMessage.error('未获取到当前页面up名字,请移动到具体播放页面')
  })
}

function addComment(children: any[]) {
  //  dialog 支持空格
  ElMessageBox.prompt('Please input 评论', 'Tip', {
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

// tab操作
const editableTabsValue = ref('土味情话')
const handleTabsEdit = async (targetName: TabPaneName, action: 'remove' | 'add') => {
  if (action === 'add') {
    ElMessageBox.prompt('Please input 分组名称', 'Tip', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',

    })
      .then(({ value }) => {
        storageDemo.value.push({
          tabName: value,
          children: [],
        })
        editableTabsValue.value = value
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Input canceled',
        })
      })
  }
  else if (action === 'remove') {
    await ElMessageBox.confirm(`确认删除该分类--${targetName}`)
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
}
</script>

<template>
  <main class="w-[800px] h-[400px] overflow-scroll px-4 py-5">
    <ElTabs v-model="editableTabsValue" editable type="border-card" @edit="handleTabsEdit">
      <ElTabPane v-for="(item) in storageDemo" :key="item.tabName" :label="item.tabName" :name="item.tabName">
        <div v-for="(subItem, subIndex) in item.children" :key="subItem.comment" class="flex items-center py-1">
          <el-tooltip
            effect="dark"
            :content="subItem.comment"
            placement="bottom-end"
          >
            <!-- {{ subIndex + 1 }}: <span class="max-w-[650px]  inline-block overflow-hidden overflow-ellipsis whitespace-nowrap">
              {{ transformEmoji(subItem.comment) }}
            </span> -->
            <!-- emoji的展示 -->
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

<script setup lang="ts">
import type { TabPaneName } from 'element-plus'
import { ElAlert, ElMessage, ElMessageBox, ElTabPane, ElTabs } from 'element-plus'
import { useClipboard } from '@vueuse/core'
import { onMessage, sendMessage } from 'webext-bridge'
import emojiJson from '../assets/emoji.json'
import { storageComments as storageDemo, upNameAliasList } from '~/logic/storage'

// 替换emoji
const emoteList = emojiJson.data.packages.map(item => item.emote).flat() // json文件从B战接口中复制过来，为方便使用先进行flat打平
function transformEmoji(comment: string) {
  function findPic(matchStr: string) {
    const emojiItem = emoteList?.find(item => item.text === matchStr)?.url
    return `<img src="${emojiItem}" class="w-[20px] h-[20px] inline">`
  }
  const replacedComment = comment.replace(/\[[\u4E00-\u9FA5\w]*\]/g, findPic) // 替换所有[xx]类型的文字为emoji
  return replacedComment
}
async function copyComment(comment: string) {
  //  每一个页签都是一个实例，所以我们要获取到当前页的ID
  browser.tabs.query({ active: true, currentWindow: true }).then(async (tabs) => {
    const tab = tabs[0]
    //   获取当前页面的id并发送获取up账号名称请求
    await sendMessage('getUpName', { title: tab.title, tabId: tab.id! }, { context: 'content-script', tabId: tab.id! })
  })
  onMessage('sendUpName', (res) => {
    // 接收到当前up的账号名称
    let upName: string = (res.data as any)?.upName
    const upNameAlias = upNameAliasList.value[upName]
    if (upNameAlias) // 如果存在映射则替换别名
      upName = upNameAlias

    const replacedComment = comment.replace('XX', upName) // 替换最后的upName
    const { copy } = useClipboard({ source: replacedComment })
    copy()
    if (upName)
      ElMessage.warning({ message: `复制成功请确认-----${replacedComment}`, duration: 3000 })
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

// tabs页签操作
const editableTabsValue = ref('土味情话')
const handleTabsEdit = async (targetName: TabPaneName | undefined, action: 'remove' | 'add') => {
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
    <el-alert title="tips:  XX字符会在复制的时候获取当前页面up主名称替换" type="warning" />
    <ElTabs v-model="editableTabsValue" editable type="border-card" @edit="handleTabsEdit">
      <ElTabPane v-for="(item) in storageDemo" :key="item.tabName" :label="item.tabName" :name="item.tabName">
        <div v-for="(subItem, subIndex) in item.children" :key="subItem.comment" class="flex items-center py-1">
          <span class="h-[20px] mr-2">{{ subIndex + 1 }}</span>
          <!-- emoji的展示 -->
          <div v-html="transformEmoji(subItem.comment)" />
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

<style scss scoped>
img{
  display: inline;
}
</style>

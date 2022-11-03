<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { onMessage, sendMessage } from 'webext-bridge'
import { storageComments as storageDemo } from '~/logic/storage'
function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

async function copyComment(comment: string) {
  // 获取当前页面up名
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const tab = tabs[0]
    sendMessage('getTextFromPopup', { title: tab.title, tabId: tab.id! }, { context: 'content-script', tabId: tab.id! })
    onMessage('sendUpName', async (res) => {
      console.log('content-script返回的', res)
      const replacedComment = comment.replace('XX', res.data.upName)
      const { copy } = useClipboard({ source: replacedComment })
      copy()
    })
  })
}
</script>

<template>
  <main class="right-0   w-[800px] px-4 py-5 text-center text-gray-700">
    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <div class="mt-2">
      <div class="opacity-0">
        Storage:{{ storageDemo[0].tabName }}
      </div>
      <div v-for="(item) in storageDemo" :key="item.tabName" class="my-2">
        <div v-for="(subItem) in item.children" :key="subItem.comment" class="my-2">
          {{ subItem.comment }}:
          <button class="btn mt-2" @click="copyComment(subItem.comment)">
            复制
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

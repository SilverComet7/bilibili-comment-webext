<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { onMessage, sendMessage } from 'webext-bridge'
import { storageComments as storageDemo } from '~/logic/storage'
function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

async function copyComment(comment: string) {
  // 获取当前页面up名
  browser.tabs.query({ active: true, currentWindow: true }).then(async (tabs) => {
    const tab = tabs[0]
    console.log(tab)
    await sendMessage('getTextFromPopup', { title: tab.title, tabId: tab.id! }, { context: 'content-script', tabId: tab.id! })
    onMessage('sendUpName', (res) => {
      // console.log('content-script返回的', res)
      const upName: string = (res.data as any).upName
      const replacedComment = comment.replace('XX', upName)
      const { copy } = useClipboard({ source: replacedComment })
      copy()
    })
  })
}

function addComment() {

}

const activeItem = ref<any>([])
console.log(storageDemo)
</script>

<template>
  <main class="w-[800px] px-4 py-5  text-gray-700">
    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <div class="mt-2">
      <!-- <div class="opacity-0">
        Storage:{{ storageDemo[0].tabName }}
      </div> -->
      <button class="btn mt-2" @click="addComment()">
        添加子集
      </button>
      <div v-for="(item) in storageDemo" :key="item.tabName" class="my-2 ">
        <button class="btn" @click="activeItem = item.children">
          {{ item.tabName }}
        </button>
        <div v-for="(subItem) in item.children" :key="subItem.comment" class=" white  w-1/2">
          <p class="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {{ subItem.comment }}
          </p>
          <button class="btn mt-2" @click="copyComment(subItem.comment)">
            复制
          </button>
        </div>
        <button class="btn mt-2" @click="addComment()">
          添加当前子集评论
        </button>
      </div>
    </div>
  </main>
</template>

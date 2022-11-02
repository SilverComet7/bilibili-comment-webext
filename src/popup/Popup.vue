<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { sendMessage } from 'webext-bridge'
import { storageDemo } from '~/logic/storage'
function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
// const bg = browser.extension.getBackgroundPage()
// console.log(bg)

async function copyComment(comment: string) {
  // 获取当前页面up名
  const data = await sendMessage('getText', '测试', 'content-script')
  console.log(data)
  const replacedComment = comment.replace('XX', '九川')
  console.log(replacedComment)

  const { copy } = useClipboard({ source: replacedComment })
  copy()
}
</script>

<template>
  <main class="w-[500px] px-4 py-5 text-center text-gray-700">
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

<script setup lang="ts">
// import { useClipboard } from '@vueuse/core'
import { storageDemo } from '~/logic/storage'
const showCopyWord = ref('123')

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

function copyComment(comment: string) {
  const replacedComment = comment.replace('XX', '九川')
  showCopyWord.value = replacedComment
  // const { text, copy, copied, isSupported } = useClipboard({ source: replacedComment })
  // console.log('🚀 ~ file: Popup.vue ~ line 15 ~ copy ~ text, copy, copied, isSupported ', text, copied, isSupported)
  // copy()
}
</script>

<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <div class="mt-2">
      {{ showCopyWord }}
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

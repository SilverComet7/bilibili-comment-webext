<script setup lang="ts">
import { upNameAliasList } from '~/logic/storage'
function deleteAlias(key: string) {
  delete (upNameAliasList.value)[key]
}
// const list = reactive([{ upName: 't', aliasName: 'test' }])
</script>

<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
    别名:
    <div v-for="(value, key) in upNameAliasList" :key="value" class="my-2">
      {{ key }}---------{{ value }}   <button class="btn bg-red-500" @click="deleteAlias(key)">
        删除
      </button>
    </div>
    <!-- <button class="btn mt-2" @click="addAlias(item.children)">
      添加别名
    </button> -->
  </main>
</template>

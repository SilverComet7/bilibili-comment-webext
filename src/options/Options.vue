<script setup lang="ts">
// import { storageDemo } from '~/logic/storage'
const upAliasList = reactive({ 落九川: '九川', XX鸟: '小橘子' })
</script>

<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
    <div v-for="(value, key) in upAliasList" :key="value" class="my-2">
      {{ key }}---------{{ value }}
    </div>
    <!-- <div class="opacity-0">
      Storage:{{ storageDemo[0].t1 }}
    </div>
    <div v-for="(item) in storageDemo" :key="item.t1" class="my-2">
      {{ item.t1 }}
    </div> -->
  </main>
</template>

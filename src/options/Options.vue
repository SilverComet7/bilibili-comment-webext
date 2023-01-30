<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { upNameAliasList } from '~/logic/storage'
async function deleteAlias(key: string) {
  await ElMessageBox.confirm('确认删除?')
  delete (upNameAliasList.value)[key]
}
function addAlias() {
  let upName = ''
  ElMessageBox.prompt('up主名称', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  })
    .then(({ value }) => {
      upName = value
      ElMessageBox.prompt('Please input up主别名', 'Tip', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
      })
        .then(({ value }) => {
          upNameAliasList.value[upName] = value
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Input canceled',
          })
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}
</script>

<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
    up主别名设置:
    <div v-for="(value, key) in upNameAliasList" :key="value" class="my-2">
      {{ key }}---------{{ value }}   <button class="btn bg-red-500" @click="deleteAlias(key)">
        删除
      </button>
    </div>
    <button class="btn mt-2" @click="addAlias()">
      添加别名
    </button>
  </main>
</template>

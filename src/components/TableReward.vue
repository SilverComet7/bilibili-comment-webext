<script lang="tsx" setup>
import type { MaybeRef } from '@vueuse/core'
import { useVModels } from '@vueuse/core'
import { ElButton, ElMessageBox, ElTable } from 'element-plus'
import { cloneDeep } from 'lodash'
const props = withDefaults(
  defineProps<{
    modelValue: any | IRowItem[]
    defaultRow?: any | IRowItem
    autoAddKey?: string
    minValue?: number
  }>(),
  {
    defaultRow: () => ({
      itemId: '8000',
      itemCount: 1,
    }),
    autoAddKey: 'id',
    minValue: 1,
  },
)
const emits = defineEmits(['update:modelValue'])
async function showConfirm(message: any) {
  await ElMessageBox.confirm('Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    dangerouslyUseHTMLString: true,
    message,
    showClose: true,
  })
}
function useEditBtn(list: MaybeRef<any[]>, defaultConfig: any, autoAddKey = '') {
  function copyItem(row: any, index: number) {
    const trueIndex = autoAddKey ? unref(list).findIndex((item: any) => item[autoAddKey] === row[autoAddKey]) : index
    const newItem = autoAddKey ? { ...row, [autoAddKey]: row[autoAddKey] + 1 } : row
    unref(list).splice(trueIndex, 0, cloneDeep(newItem))
  }

  async function deleteItem(row: any, index: number) {
    await showConfirm('确认删除该项数据吗')
    const trueIndex = autoAddKey ? unref(list).findIndex((item: any) => item[autoAddKey] === row[autoAddKey]) : index
    unref(list).splice(trueIndex, 1)
  }

  function pushItem() {
    const unList = unref(list)
    let addValue
    if (autoAddKey) {
      if (unList.length) {
        // todo fix  autoAddKey = ''
        const lastItem = unList[unList.length - 1][autoAddKey]
        addValue = Number.isNaN(Number(lastItem)) ? lastItem + 1 : (+lastItem + 1).toString()
      }
      else {
        addValue = defaultConfig[autoAddKey]
      }
    }
    const newItem = autoAddKey
      ? {
          ...defaultConfig,
          [autoAddKey]: addValue,
        }
      : defaultConfig
    unList.push(cloneDeep(newItem))
  }

  function GenerateButtons() {
    return (
      <el-table-column align="center" width="200px" fixed="right">
        {{
          default: (scope: any) => (
            <>
              <el-button
                text
                type="primary"
                icon="CopyDocument"
                plain
                onClick={() => copyItem(scope.row, scope.$index)}
              >
                复制
              </el-button>
              <el-button text type="danger" icon="Delete" plain onClick={() => deleteItem(scope.row, scope.$index)}>
                删除
              </el-button>
            </>
          ),
        }}
      </el-table-column>
    )
  }

  return { copyItem, deleteItem, pushItem, GenerateButtons }
}

interface IRowItem {
  itemId: string
  itemCount?: number
  canBroadcast?: boolean
  weight?: number
}

const { modelValue } = useVModels(props, emits)

const { pushItem, GenerateButtons } = useEditBtn(modelValue, props.defaultRow, props.autoAddKey)
</script>

<template>
  <div>
    <el-table :data="modelValue" stripe border tooltip-effect="dark">
      <slot name="beforeExtra" />
      <slot />
      <slot name="extra" />
      <GenerateButtons />
    </el-table>
    <el-button type="primary" class="mt-1" icon="Plus" plain @click="pushItem()">
      添加
    </el-button>
  </div>
</template>

<style lang="scss" scoped></style>

import { useStorageLocal } from '~/composables/useStorageLocal'

export const storageDemo = useStorageLocal('webext-demo', [{ tabName: '土味', children: [{ comment: 'XX 今天顾客投诉我了 说我炒菜咸 厨师长把我的锅锤烂了 问我是不是盐不要钱 他不知道的是我没有多放盐 只是炒菜的时候很想你 眼泪掉进了锅里', previewImgPath: 'xxx' }] }], {
  listenToStorageChanges: true,
})

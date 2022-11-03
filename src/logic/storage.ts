import { useStorageLocal } from '~/composables/useStorageLocal'

export const storageComments = useStorageLocal('bilibili-comments', [{ tabName: '土味', children: [{ comment: 'XX 今天顾客投诉我了 说我炒菜咸 厨师长把我的锅锤烂了 问我是不是盐不要钱 他不知道的是我没有多放盐 只是炒菜的时候很想你 眼泪掉进了锅里', previewImgPath: 'xxx' }] }, { tabName: 'ik', children: [{ comment: '只', previewImgPath: 'xxx' }] }, { tabName: '楼中楼', children: [{ comment: 'XX+10度', previewImgPath: 'xxx' }] }], {
  listenToStorageChanges: true,
})

// export const storageAlias = useStorageLocal('up-alias')

import { useStorageLocal } from '~/composables/useStorageLocal'

export const storageComments = useStorageLocal('bilibili-comments', [{ tabName: '土味情话', children: [{ comment: 'XX 今天顾客投诉我了 说我炒菜咸 厨师长把我的锅锤烂了 问我是不是盐不要钱 他不知道的是我没有多放盐 只是炒菜的时候很想你 眼泪掉进了锅里', previewImgPath: 'xxx' }] }, { tabName: 'ikun', children: [{ comment: '只因', previewImgPath: 'xxx' }, { comment: '小黑子', previewImgPath: '' }] }, { tabName: '回复', children: [{ comment: 'XX+10度', previewImgPath: 'xxx' }] }], {
  listenToStorageChanges: true,
})

// export const storageAlias = useStorageLocal('up-alias')

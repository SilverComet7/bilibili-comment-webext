import { useStorageLocal } from '~/composables/useStorageLocal'

export const storageComments = useStorageLocal(
  'bilibili-comments',
  [
    {
      tabName: '土味情话',
      children: [
        {
          comment:
            'XX 今天顾客投诉我了 说我炒菜咸 厨师长把我的锅锤烂了 问我是不是盐不要钱 他不知道的是我没有多放盐 只是炒菜的时候很想你 眼泪掉进了锅里[大哭]',
        },
        {
          comment:
            'XX最近的视频质量有所下降啊，无论是视频剪辑还是配音，都没有之前好，这边建议加我微信，给你指点一下[doge]',
        },
        {
          comment:
            'XX的长相身材还可以，但没有故事，视频不能引起观众感情上的共鸣。这些主要还是阅历浅的缘故，所以在表达上欠缺。如果真的想有所发展的话，可以私聊我vx，我可以给你一场撕心裂肺的恋情，帮助你做出更好的作品[脱单doge]',
        },
        {
          comment:
            'XX！说实话，你的气质形象这么好，但是现在关注量却涨的不快了，应该是不太会整活。看你的面容，就应该整生活记录这种路数，那么建议你出一期我和你的约会视频，记录一下你的约会内容和我追上你的经验分享给网友，肯定可以火的。',
        },
        {
          comment: `XX，我把我的心取出来给你
            [哈欠]→[抓狂]→[给心心]
            我还能把它放回去
            [给心心]→[偷笑]→[害羞]
            我再给你演示一遍
            [哈欠]→[抓狂]→[抓狂]→[抓狂]
            咦，我的心呢[难过]
            原来是你把我的心偷走了[大哭]`,
        },
      ],
    },
    {
      tabName: '花式要wx',
      children: [
        {
          comment:
            '我是医学生。我跟你说句实在话，你这种身材虽然看起来好看，但其实是健身过度的表现 像你这样初期症状很不容易被发现，一旦发现就会是晚期难以治愈。最好的办法是给我发下你的WeChat，给我几张高清大图，我放大研究后，告诉你该如何对症下药。年轻人，宜早不宜迟啊',
        },
      ],
    },
    // {
    //   tabName: "ikun",
    //   children: [
    //     { comment: "只因你太美" },
    //     { comment: "小黑子食不食油饼" },
    //     { comment: "ikun提高班之--铁山靠" },
    //   ],
    // },
  ],
  {
    listenToStorageChanges: true,
  },
)

export const upNameAliasList = useStorageLocal(
  'up-alias',
  { Tacica鳥: '小橘子', 落九川: '九川' } as Record<string, string>,
  {
    listenToStorageChanges: true,
  },
)

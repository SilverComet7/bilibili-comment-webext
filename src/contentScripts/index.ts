/* eslint-disable no-console */
import { onMessage, sendMessage } from 'webext-bridge'
import { createApp } from 'vue'
import App from './views/App.vue'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.info('[vitesse-webext] Hello world from content script')

  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
  })
  onMessage('getUpName', ({ data }) => {
    console.log('接受到来自pop的信息', data)
    const bilibiliUpNameWrap = document.getElementsByClassName('username') as any // a标签
    console.log(bilibiliUpNameWrap, bilibiliUpNameWrap.length, 'wrap')
    let bilibiliUpName: string | undefined
    if (bilibiliUpNameWrap.length) { // 类数组有值
      bilibiliUpName = bilibiliUpNameWrap[0]?.innerText
    }
    sendMessage('sendUpName', { upName: bilibiliUpName }, 'popup')
  })

  // mount component to context window
  /* const container = document.createElement('div')
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.appendChild(container)
  createApp(App).mount(root) */
})()

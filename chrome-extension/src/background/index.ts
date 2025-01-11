import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';
import * as Apis from '@extension/service';
import type { EditBookmark } from '@extension/types';
import { setCustomTitle } from '@extension/utils';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");

chrome.runtime.onConnect.addListener(port => {
  port.onDisconnect.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tab = tabs[0];
      chrome.runtime.sendMessage(tab.id?.toString(), { type: 'clearFields' });
    });
  });
});

// refer: [javascript - 带有异步等待的 chrome.runtime.onMessage 响应 - SegmentFault 思否](https://segmentfault.com/q/1010000043068868)
const wrapAsyncFunction = (listener: any) => (message: any, sender: any, sendResponse: any) => {
  // the listener(...) might return a non-promise result (not an async function), so we wrap it with Promise.resolve()
  Promise.resolve(listener(message, sender)).then(() => sendResponse({ status: 'success' }));
  return true; // return true to indicate you want to send a response asynchronously
};

chrome.runtime.onMessage.addListener(
  wrapAsyncFunction(async (message: any) => {
    if (message.type === 'saveSidePanelBookmark') {
      // 处理保存书签的逻辑
      // 例如，保存到存储中
      const bookmarks = message.payload as EditBookmark;
      const { parentId, url } = message.payload as EditBookmark;

      const newTitle = setCustomTitle(bookmarks);

      // 创建新目录
      if (![null, undefined, ''].includes((message.payload as EditBookmark).newDir)) {
        const dirIndex = await Apis.createBookmark({
          id: (message.payload as EditBookmark).parentId,
          changes: {
            title: message.payload.newDir,
          },
        });
        await Apis.createBookmark({
          id: dirIndex.id,
          changes: {
            title: newTitle,
            url: message.payload.url,
          },
        });
        return;
      }
      // 更新
      const { isExist, bookmarks: bookmarkItem } = await Apis.isExistBookmark(url);
      if (isExist && bookmarkItem[0]) {
        await Apis.updateBookmark({ id: bookmarkItem[0].id, changes: { title: newTitle } });
        return;
      }
      // 如果添加了自定义描述，则修改书签标题，后面添加 __DESC__${customDescription}
      await Apis.createBookmark({ id: parentId, changes: { title: newTitle, url } });
    }
  }),
);

let curPanelId: number;

chrome.action.onClicked.addListener(async tab => {
  // 我想打开 sidePanel 默认配置，应该如何配置参数
  curPanelId = tab.id as number;
  // http or https
  const reg = /^(http|https):\/\//;
  if (!reg.test(tab.url as string)) {
    return;
  }
  await chrome.sidePanel.open({
    tabId: tab.id as number,
  });
});

// // 切换至其他 tab 的时候，关闭 side-panel
// chrome.tabs.onActivated.addListener(async activeInfo => {
//   const tabId = activeInfo.tabId;
//   if (curPanelId != null && curPanelId !== tabId) {
//     await chrome.sidePanel.setOptions({
//       tabId,
//       enabled: false,
//     });
//   }
// });

// 监听 side-panel 的消息，当 message = closePanel 时，关闭 side-panel
chrome.runtime.onMessage.addListener(message => {
  if (message === 'closePanel' && curPanelId != null) {
    chrome.sidePanel.setOptions({
      tabId: curPanelId,
      enabled: false,
    });
  }
  return true;
});

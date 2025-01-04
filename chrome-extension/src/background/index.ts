import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';
import { BOOKMARK_CUSTOM_SPLIT } from '@extension/constants';
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

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'saveBookmark') {
    console.log('Received bookmark data:', message.payload);
    // 处理保存书签的逻辑
    // 例如，保存到存储中
    const bookmarks = message.payload as {
      customDescription: string;
      parentId: string;
      title: string;
      url: string;
    };
    const { customDescription, parentId, url } = bookmarks;
    // 如果添加了自定义描述，则修改书签标题，后面添加 __DESC__${customDescription}
    const newTitle = customDescription
      ? `${bookmarks.title}${BOOKMARK_CUSTOM_SPLIT}${customDescription}`
      : bookmarks.title;
    await Apis.createBookmark({ id: parentId, changes: { title: newTitle, url } });
    sendResponse({ status: 'success' });
    return true; // 表示异步响应
  }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'saveSidePanelBookmark') {
    // 处理保存书签的逻辑
    // 例如，保存到存储中
    const bookmarks = message.payload as EditBookmark;
    const { parentId, url } = message.payload as EditBookmark;

    const newTitle = setCustomTitle(bookmarks);
    console.log('bookmarks ==>>> ', bookmarks);
    console.log('newTitle ==>>> ', newTitle);

    // 创建新目录
    if ((message.payload as EditBookmark).newDir != null) {
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

      sendResponse({ status: 'success' });
      return true;
    }

    // 如果添加了自定义描述，则修改书签标题，后面添加 __DESC__${customDescription}
    await Apis.createBookmark({ id: parentId, changes: { title: newTitle, url } });
    sendResponse({ status: 'success' });
    return true; // 表示异步响应
  }
});

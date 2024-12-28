import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

console.log("background loaded");


chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      chrome.runtime.sendMessage(tab.id?.toString(), { type: "clearFields" });
    });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "saveBookmark") {
    console.log("Received bookmark data:", message.payload);
    // 处理保存书签的逻辑
    // 例如，保存到存储中
    chrome.storage.local.set({ [message.payload.currentUrl]: message.payload }, () => {
      console.log("Bookmark saved");
      sendResponse({ status: "success" });
    });
    return true; // 表示异步响应
  }
});
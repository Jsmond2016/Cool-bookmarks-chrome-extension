// import '@src/SidePanel.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { Card, ConfigProvider, Form, message } from 'antd';
import { EditBookmarkFormContent } from '@extension/components';
import * as Apis from '@extension/service';
import { to } from 'await-to-js';
import type { EditBookmark } from '@extension/types';

import { getCustomTitle } from '@extension/utils';
import { useMount } from 'ahooks';
const SidePanel = () => {
  const [form] = Form.useForm<EditBookmark>();
  const [messageApi, contextHolder] = message.useMessage();
  const handleSave = async () => {
    const values = await form.validateFields();
    chrome.runtime.sendMessage(
      {
        type: 'saveSidePanelBookmark',
        payload: values,
      },
      async response => {
        if (response?.status === 'success') {
          messageApi.success('保存成功');
          await chrome.runtime.sendMessage({ type: 'closePanel' });
        } else {
          message.error('保存失败');
          console.log('saveBookmark error -> response', response);
        }
      },
    );
  };

  // 定义要在目标页面中执行的函数
  const getJuejinTitleContent = () => {
    const articleTitle = document.querySelector('.article-title');
    return articleTitle ? articleTitle.textContent : null;
  };

  const getJuejinTitle = async ({ tab }: { tab: chrome.tabs.Tab }) => {
    return chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: getJuejinTitleContent,
    });
  };

  useMount(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
      if (tabs && tabs.length > 0) {
        const tab = tabs[0];

        // 更新书签
        const { isExist, bookmarks } = await Apis.isExistBookmark(tab.url as string);
        if (isExist) {
          const { id, url, parentId, title } = bookmarks[0];
          const formFields = getCustomTitle(title);
          form.setFieldsValue({
            id,
            url,
            parentId,
            ...formFields,
          });
          return;
        }

        // 创建书签
        // 检查是否是掘金的文章页面
        if (tab.url?.includes('juejin.cn/post/')) {
          const [err, injectionResults] = await to(getJuejinTitle({ tab }));
          if (err) {
            console.error('Error executing script:', err);
            form.setFieldsValue({
              url: tab.url,
              title: tab.title,
            });
            return;
          }
          const juejinTitle = injectionResults[0].result;
          form.setFieldsValue({
            url: tab.url,
            title: juejinTitle?.trim() || tab.title?.trim() || '',
          });
        } else {
          form.setFieldsValue({
            url: tab.url,
            title: tab.title,
          });
        }
      } else {
        console.error('No active tab found');
      }
    });
  });

  return (
    <Card title="保存书签">
      <ConfigProvider
        theme={{
          components: {
            Form: {
              itemMarginBottom: 12,
            },
          },
        }}>
        {contextHolder}
        <EditBookmarkFormContent form={form} onSave={handleSave} mode="create" />
      </ConfigProvider>
    </Card>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);

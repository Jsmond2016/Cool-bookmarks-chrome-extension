import React, { useEffect } from 'react';
// import "@pages/popup/Popup.css";
import { Button, Card, ConfigProvider, Form, Input, Row } from 'antd';
import { ApiSelect } from '@extension/components';
import * as Apis from '@extension/service';
import { to } from 'await-to-js';
import { BOOKMARK_CUSTOM_SPLIT } from '@extension/constants';
const Popup = () => {
  const [form] = Form.useForm();
  const handleSave = async () => {
    console.log('cool-bookmark-save');
    const values = await form.validateFields();
    if (values.id) {
      const { id, title, customDescription, url } = values;
      const newTitle = `${title}${BOOKMARK_CUSTOM_SPLIT}${customDescription}`;
      await Apis.updateBookmark({ id, changes: { title: newTitle, url } });
      return;
    }
    chrome.runtime.sendMessage(
      {
        type: 'saveBookmark',
        payload: values,
      },
      response => {
        console.log('saveBookmark response', response);
        if (response.status === 'success') {
          // 当成功时，弹出 成功提示，关闭 popup
          chrome.notifications.create({
            type: 'basic',
            iconUrl: '/icon-128.png',
            title: '保存成功',
            message: '书签保存成功',
          });
        } else {
          console.error('Failed to save bookmark');
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

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
      if (tabs && tabs.length > 0) {
        const tab = tabs[0];

        // 更新书签
        const { isExist, bookmarks } = await Apis.isExistBookmark(tab.url as string);
        if (isExist) {
          // 存在-则解析 url，title，description

          const { id, title, url, parentId } = bookmarks[0];
          const [sourceTitle, customDescription] = title.split(BOOKMARK_CUSTOM_SPLIT);
          form.setFieldsValue({
            id,
            parentId,
            title: sourceTitle,
            url,
            customDescription,
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
  }, [form]);

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
        <Form form={form} preserve={false} layout="vertical">
          <Form.Item
            name="parentId"
            label="保存目标文件夹"
            rules={[{ required: true, message: '请输入保存目标文件夹' }]}>
            <ApiSelect />
          </Form.Item>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="url" label="当前页面url" rules={[{ required: true, message: '请输入当前页面url' }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="title" label="当前页面标题" rules={[{ required: true, message: '请输入当前页面标题' }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="customDescription"
            label="读后感评价和描述"
            rules={[{ required: true, message: '请输入读后感评价和描述' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Row justify="end">
            <Button type="primary" onClick={handleSave}>
              保存
            </Button>
          </Row>
        </Form>
      </ConfigProvider>
    </Card>
  );
};

export default Popup;

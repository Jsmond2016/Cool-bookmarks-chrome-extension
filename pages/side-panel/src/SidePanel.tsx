import '@src/SidePanel.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { useEffect } from 'react';
import { Button, Card, ConfigProvider, Form, Input, Radio, Row, Select, message } from 'antd';
import { ApiSelect, FormItem } from '@extension/components';
import * as Apis from '@extension/service';
import { to } from 'await-to-js';
import { toPairs } from 'ramda';
import type { EditBookmark } from '@extension/types';
import type { DaySecondCategoryEnum } from '@extension/constants';
import {
  DayFirstCategoryEnum,
  DirTypeEnum,
  DirTypeOptions,
  PriorityEnum,
  PriorityOptions,
  DayFirstCategoryOptions,
  FirstBindSecondCategoryRelation,
  DaySecondCategoryOptions,
} from '@extension/constants';
import { getCustomTitle } from '@extension/utils';

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

  useEffect(() => {
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
        {contextHolder}
        <Form form={form} preserve={false} layout="vertical">
          <Form.Item rules={[{ required: true }]} label="文件夹选项" name="dirType" initialValue={DirTypeEnum.Exist}>
            <Radio.Group
              onChange={() => form.setFieldValue('newDir', undefined)}
              options={toPairs(DirTypeOptions).map(([key, label]) => ({ label, value: +key }))}
            />
          </Form.Item>
          <Form.Item name="parentId" label="父级文件夹" rules={[{ required: true }]}>
            <ApiSelect />
          </Form.Item>
          <Form.Item<EditBookmark> noStyle shouldUpdate={(pre, cur) => pre.dirType !== cur.dirType}>
            {({ getFieldValue }) =>
              getFieldValue('dirType') === DirTypeEnum.New ? (
                <Form.Item
                  name="newDir"
                  label="新建文件夹名称"
                  rules={[{ required: getFieldValue('dirType') === DirTypeEnum.New }]}>
                  <Input />
                </Form.Item>
              ) : null
            }
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
          <Form.Item label="优先级" name="priority" initialValue={PriorityEnum.Medium}>
            <Select
              onChange={value => {
                if (value === PriorityEnum.Highest) {
                  form.setFieldValue('firstCategory', DayFirstCategoryEnum.Important);
                } else {
                  form.setFieldValue('firstCategory', undefined);
                }
              }}
              options={toPairs(PriorityOptions)
                .toSorted((a, b) => b[0] - a[0])
                .map(([key, label]) => ({ value: +key, label }))}
            />
          </Form.Item>
          <FormItem rules={[{ required: true }]} name="firstCategory" label="一级分类">
            <Select
              onChange={() => form.setFieldValue('secondCategory', undefined)}
              options={toPairs(DayFirstCategoryOptions).map(([key, label]) => ({ value: key, label }))}
            />
          </FormItem>
          <Form.Item noStyle shouldUpdate={(pre, cur) => pre.firstCategory !== cur.firstCategory}>
            {({ getFieldValue }) => {
              const firstId = getFieldValue('firstCategory') as DayFirstCategoryEnum;
              const bindKeyEnums = FirstBindSecondCategoryRelation[firstId] || [];
              const options = bindKeyEnums.map((key: DaySecondCategoryEnum) => ({
                value: key,
                label: DaySecondCategoryOptions[key],
              }));
              return (
                <Form.Item name="secondCategory" label="二级分类">
                  <Select options={options} />
                </Form.Item>
              );
            }}
          </Form.Item>
          <Form.Item name="aiSummary" label="AI总结">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="description" label="读后感评价和描述">
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

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);

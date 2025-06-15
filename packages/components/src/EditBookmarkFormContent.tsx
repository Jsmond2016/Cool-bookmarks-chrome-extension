import React from 'react';
import type { FormInstance } from 'antd';
import { Button, Form, Input, Radio, Row, Select } from 'antd';
import ApiSelect from './ApiSelect';
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

type EditBookmarkFormContentProps = {
  form: FormInstance;
  onSave?: () => void;
  showFooter?: boolean;
  mode?: 'create' | 'edit';
};

const EditBookmarkFormContent = ({
  form,
  onSave,
  showFooter = true,
  mode = 'create',
}: EditBookmarkFormContentProps) => {
  const isCreateMode = mode === 'create';

  return (
    <Form form={form} preserve={false} layout="vertical">
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      {isCreateMode && (
        <>
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
        </>
      )}
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
      <Form.Item rules={[{ required: true }]} name="firstCategory" label="一级分类">
        <Select
          onChange={() => form.setFieldValue('secondCategory', undefined)}
          options={toPairs(DayFirstCategoryOptions).map(([key, label]) => ({ value: key, label }))}
        />
      </Form.Item>
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
      {showFooter && (
        <Row justify="end">
          <Button type="primary" onClick={onSave}>
            保存
          </Button>
        </Row>
      )}
    </Form>
  );
};

export default EditBookmarkFormContent;

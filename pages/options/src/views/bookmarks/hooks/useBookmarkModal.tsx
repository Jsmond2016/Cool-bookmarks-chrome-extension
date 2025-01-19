import { useRef, useState } from 'react';
import { Modal, Input, Form, message, Select } from 'antd';
import * as api from '@extension/service';
import { setCustomTitle, sourceMap } from '@extension/utils';
import type { EditBookmark } from '@extension/types';
import type { DaySecondCategoryEnum } from '@extension/constants';
import {
  DayFirstCategoryEnum,
  DayFirstCategoryOptions,
  DaySecondCategoryOptions,
  FirstBindSecondCategoryRelation,
  PriorityEnum,
  PriorityOptions,
} from '@extension/constants';
import { ApiSelect } from '@extension/components';
import { toPairs } from 'ramda';

const useEditBookmarkModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const setFormFields = (defaultValues: EditBookmark) => {
    const { parentId, ...rest } = defaultValues;
    form.setFieldsValue({
      ...rest,
      dirId: parentId,
    });
  };

  const onSuccessCBRef = useRef<(() => void) | null>(null);

  const openModalAndSetValues = (values: EditBookmark, cb: () => void) => {
    setModalVisible(true);
    const { title, description, aiSummary, firstCategory, secondCategory } = values;
    const formValues = {
      ...values,
      title,
      description,
      aiSummary,
      secondCategory,
      firstCategory,
    };
    setFormFields(formValues);
    onSuccessCBRef.current = cb;
  };

  const updateBookmark = async () => {
    const values = await form.validateFields();
    const { id, url, dirId } = values;
    const title = setCustomTitle(values);
    try {
      await api.updateBookmark({ id, changes: { title, url } });
      if (dirId) {
        await api.moveBookmark(id, dirId);
      }
      // TODO: source / description 没有保存
      message.success('修改成功');
      onSuccessCBRef.current?.();
      setModalVisible(false);
    } catch (error) {
      console.log('error', error);
      message.error('修改失败');
    }
  };

  const ele = (
    <Modal
      title="编辑书签"
      open={modalVisible}
      onOk={updateBookmark}
      onCancel={() => setModalVisible(false)}
      maskClosable={false}
      destroyOnClose>
      <Form form={form} preserve={false}>
        <Form.Item noStyle name="id" />
        <Form.Item label="名字" name="title" required rules={[{ required: true, message: '请输入书签名' }]}>
          <Input.TextArea rows={2} placeholder="请输入书签名" />
        </Form.Item>
        <Form.Item label="链接" name="url" required rules={[{ required: true, message: '链接' }]}>
          <Input.TextArea rows={2} placeholder="请输入链接" />
        </Form.Item>
        <Form.Item label="所属文件夹" name="dirId">
          <ApiSelect />
        </Form.Item>
        <Form.Item label="来源" name="source">
          <Select
            optionFilterProp="label"
            options={[...new Set(Object.values(sourceMap))].map(v => ({ value: v, label: v }))}
          />
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
        <Form.Item label="描述" name="description">
          <Input.TextArea rows={8} placeholder="请输入自定义描述" />
        </Form.Item>
      </Form>
    </Modal>
  );

  return {
    editBookmarkModal: openModalAndSetValues,
    modalElement: ele,
  };
};

export default useEditBookmarkModal;

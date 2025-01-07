import { useRef, useState } from 'react';
import { Modal, Input, Form, message, Select } from 'antd';
import * as api from '@extension/service';
import { setCustomTitle, sourceMap } from '@extension/utils';
import type { EditBookmark } from '@extension/types';
import { PriorityEnum, PriorityOptions } from '@extension/constants';
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
    const { title, description, aiSummary } = values;
    const formValues = {
      ...values,
      title,
      description,
      aiSummary,
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
        <Form.Item label="优先级" name="priority" initialValue={PriorityEnum.Higher}>
          <Select
            options={toPairs(PriorityOptions)
              .toSorted((a, b) => b[0] - a[0])
              .map(([key, label]) => ({ value: +key, label }))}
          />
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

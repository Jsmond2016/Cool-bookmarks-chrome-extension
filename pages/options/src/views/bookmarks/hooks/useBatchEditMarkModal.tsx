import { useRef, useState } from 'react';
import { Modal, Form, message } from 'antd';
import * as api from '@extension/service';
import type { IBookMark } from '@extension/types';
import { ApiSelect } from '@extension/components';

const useBatchEditMarkModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const onSuccessCBRef = useRef<(() => void) | null>(null);
  const setFormFields = (ids: IBookMark['id'][], onSuccessCallback) => {
    form.setFieldsValue({ ids });
    onSuccessCBRef.current = onSuccessCallback;
  };

  const openModalAndSetValues = (values: IBookMark['id'][], cb) => {
    setModalVisible(true);
    setFormFields(values, cb);
  };

  const updateBookmark = async () => {
    const values = await form.validateFields();
    const { ids, dirId } = values;
    await api.batchMove(ids, dirId);
    message.success('批量修改成功');
    onSuccessCBRef.current?.();
    setModalVisible(false);
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
        <Form.Item noStyle name="ids" />
        <Form.Item label="所属文件夹" name="dirId">
          <ApiSelect />
        </Form.Item>
      </Form>
    </Modal>
  );

  return {
    editBatchEditModal: openModalAndSetValues,
    ele,
  };
};

export default useBatchEditMarkModal;

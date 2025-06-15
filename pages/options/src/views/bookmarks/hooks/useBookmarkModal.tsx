import { useRef, useState } from 'react';
import { Modal, Form, message } from 'antd';
import * as api from '@extension/service';
import { setCustomTitle } from '@extension/utils';
import type { EditBookmark } from '@extension/types';

import { EditBookmarkFormContent } from '@extension/components';

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
      <EditBookmarkFormContent form={form} showFooter={false} mode="edit" />
    </Modal>
  );

  return {
    editBookmarkModal: openModalAndSetValues,
    modalElement: ele,
  };
};

export default useEditBookmarkModal;

import { useRef, useState } from 'react';
import { Modal, Form, message, Select } from 'antd';
import * as api from '@extension/service';
import type { IBookMark } from '@extension/types';
import { ApiSelect } from '@extension/components';
import { toPairs } from 'ramda';
import type { DayFirstCategoryEnum, DaySecondCategoryEnum } from '@extension/constants';
import {
  DayFirstCategoryOptions,
  DaySecondCategoryOptions,
  FirstBindSecondCategoryRelation,
} from '@extension/constants';
import { setCustomTitle } from '@extension/utils';

const useBatchEditMarkModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const onSuccessCBRef = useRef<(() => void) | null>(null);
  const setFormFields = (values: IBookMark[], onSuccessCallback) => {
    form.setFieldsValue({ selectedRows: values });
    onSuccessCBRef.current = onSuccessCallback;
  };

  const openModalAndSetValues = (values: IBookMark[], cb) => {
    setModalVisible(true);
    setFormFields(values, cb);
  };

  const updateBookmark = async () => {
    const values = await form.validateFields();
    const { selectedRows, dirId, firstCategory, secondCategory } = values;

    if (!dirId && [firstCategory, secondCategory].every(v => Boolean(!v))) {
      message.error('请选择要修改的书签');
      return;
    }

    if (dirId && [firstCategory, secondCategory].every(v => Boolean(!v))) {
      await api.moveBookmarks(selectedRows.map(bookmark => ({ id: bookmark.id, destinationId: dirId })));
      message.success('批量移动成功');
      return;
    } else {
      // 移动 + 修改
      const newBookmarks = selectedRows.map(bookmark => ({
        id: bookmark.id,
        parentId: dirId,
        changes: {
          title: setCustomTitle({ ...bookmark, firstCategory, secondCategory }),
        },
      }));
      await api.batchMove(newBookmarks);
    }
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
        <Form.Item noStyle name="selectedRows" />
        <Form.Item label="所属文件夹" name="dirId">
          <ApiSelect />
        </Form.Item>
        <Form.Item name="firstCategory" label="一级分类">
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
      </Form>
    </Modal>
  );

  return {
    editBatchEditModal: openModalAndSetValues,
    ele,
  };
};

export default useBatchEditMarkModal;

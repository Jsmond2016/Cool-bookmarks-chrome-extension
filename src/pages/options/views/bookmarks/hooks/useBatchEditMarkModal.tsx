import { useState } from "react";
import { Modal, Input, Form, message, Select } from "antd";
import * as api from "../../../api";
import { sourceMap } from "../../../utils";
import { IBookMark } from "../";
import { ApiSelect } from "../components/filter";

const useBatchEditMarkModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const setFormFields = (ids: IBookMark["id"][]) => {
    // const { title, description, url, source, id } = defaultValues;
    form.setFieldsValue({ ids });
  };

  const openModalAndSetValues = (values: IBookMark["id"][]) => {
    setModalVisible(true);
    setFormFields(values);
  };

  const updateBookmark = async () => {
    const values = await form.validateFields();
    console.log("values: ", values);
    const { ids, dirId } = values;
    const rs = await api.batchMove(ids, dirId);
    console.log("rs: ", rs);
    message.success("批量修改成功");
    setModalVisible(false);
  };

  const ele = (
    <Modal
      title="编辑书签"
      open={modalVisible}
      onOk={updateBookmark}
      onCancel={() => setModalVisible(false)}
      maskClosable={false}
      destroyOnClose
    >
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

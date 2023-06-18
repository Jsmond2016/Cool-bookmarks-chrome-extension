import { useState, useRef } from "react";
import { Modal, List, Input, Form, message } from "antd";
import * as api from "../../../api";
import { buildShortUUID } from "../../../utils";
import { IBookMark } from '..';

const mode = {
  EDIT: 'EDIT',
  PREVIEW: 'PREVIEW'
}

const useSectionModal = () => {
  
  const [visible, setVisible] = useState(false)
  const propRef = useRef({
    list: [],
    mode: mode.EDIT
  });
  const [form] = Form.useForm();

  const saveSection = async () => {
    const values = await form.validateFields();
    const sectionData = {
      list: propRef.current.list,
      ...values,
      sectionId: buildShortUUID(),
      createdDate: new Date().getTime(),
    };
    const res = await api.saveSection({ data: sectionData });
    if (!(res || "").includes("success")) return;
    message.success("保存成功");
    setVisible(false);
  };

  const openModalAndSetValues = (list: IBookMark[], _mode: keyof typeof mode) => {
    propRef.current.list = list;
    propRef.current.mode = _mode,
    setVisible(true);
  }


  const ele = (
    <Modal
      title={propRef.current.mode === mode.EDIT ? "设置片段" : "片段详情"}
      open={visible}
      footer={propRef.current.mode === mode.PREVIEW ? null : undefined }
      onOk={saveSection}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      destroyOnClose
    >
      <Form form={form} preserve={false}>
        {propRef.current.mode === mode.EDIT && (
          <Form.Item
            label="片段名"
            name="sectionName"
            required
            rules={[{ required: true, message: "请输入片段名" }]}
          >
            <Input placeholder="请输入片段名" />
          </Form.Item>
        )}
        <List
          style={{ maxHeight: "460px", overflowY: "scroll" }}
          bordered
          dataSource={propRef.current.list}
          renderItem={(item) => (
            <List.Item>
              <a href={item.link}>{item.bookmarkName}</a>
            </List.Item>
          )}
        />
      </Form>
    </Modal>
  )

  return {
    editSectionModal: openModalAndSetValues,
    ele
  };
};

export default useSectionModal;

import { useRef, useState } from "react";
import { Modal, Input, Form, message, Select } from "antd";
import * as api from "@src/pages/apis";
import { sourceMap } from "../../../utils";
import { IBookMark } from "../";
import ApiSelect from "@src/components/ApiSelect";
import { BOOKMARK_CUSTOM_SPLIT } from "@src/constants/constant";

const useEditBookmarkModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const setFormFields = (defaultValues: IBookMark) => {
    const { title, description, url, source, id, parentId } = defaultValues;
    form.setFieldsValue({
      title,
      description,
      url,
      source,
      id,
      dirId: parentId,
    });
  };

  const onSuccessCBRef = useRef(null);

  const openModalAndSetValues = (values: IBookMark, cb) => {
    setModalVisible(true);
    const [sourceTitle, customDescription] = values.title.split(
      BOOKMARK_CUSTOM_SPLIT
    );
    const formValues = {
      ...values,
      title: sourceTitle,
      description: customDescription || "",
    };
    setFormFields(formValues);
    onSuccessCBRef.current = cb;
  };

  const updateBookmark = async () => {
    const values = await form.validateFields();
    const { id, title, url, dirId, description } = values;
    const newTitle = `${title}${BOOKMARK_CUSTOM_SPLIT}${description}`;
    try {
      await api.updateBookmark({ id, changes: { title: newTitle, url } });
      if (dirId) {
        await api.moveBookmark(id, dirId);
      }
      // TODO: source / description 没有保存
      message.success("修改成功");
      onSuccessCBRef.current?.();
      setModalVisible(false);
    } catch (error) {
      console.log("error", error);
      message.error("修改失败");
    }
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
        <Form.Item noStyle name="id" />
        <Form.Item
          label="名字"
          name="title"
          required
          rules={[{ required: true, message: "请输入书签名" }]}
        >
          <Input.TextArea rows={2} placeholder="请输入书签名" />
        </Form.Item>
        <Form.Item
          label="链接"
          name="url"
          required
          rules={[{ required: true, message: "链接" }]}
        >
          <Input.TextArea rows={2} placeholder="请输入链接" />
        </Form.Item>
        <Form.Item label="所属文件夹" name="dirId">
          <ApiSelect />
        </Form.Item>
        <Form.Item label="来源" name="source">
          <Select>
            {[...new Set(Object.values(sourceMap))].map((item) => (
              <Select.Option value={item}>{item}</Select.Option>
            ))}
          </Select>
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

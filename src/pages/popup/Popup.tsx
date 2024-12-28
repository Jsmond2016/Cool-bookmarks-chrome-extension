import React, { useEffect } from "react";
// import "@pages/popup/Popup.css";
import { Button, Card, Form, Input, Row, Space } from "antd";
import ApiSelect from "@src/components/ApiSelect";

/**
 * 

- 当前页面url: Input
- 当前页面标题: Input
- 读后感评价和描述；Input.Textare
- 保存目标文件夹：Select


 * 
 * 
 */

const Popup = () => {
  const [form] = Form.useForm();
  const handleSave = async () => {
    console.log(form.getFieldsValue());
    const values = await form.validateFields();
    chrome.runtime.sendMessage({
      type: "saveBookmark",
      payload: values,
    });
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      form.setFieldsValue({
        currentUrl: tab.url,
        currentTitle: tab.title,
      });
    });

    // 监听清空字段的消息
    const handleClearFields = (message: any) => {
      if (message.type === "clearFields") {
        form.resetFields();
      }
    };

    chrome.runtime.onMessage.addListener(handleClearFields);

    // 清除事件监听器
    return () => {
      chrome.runtime.onMessage.removeListener(handleClearFields);
    };
  }, [form]);

  return (
    <Card title="保存书签">
      <Form form={form} preserve={false} layout="vertical">
        <Form.Item
          name="currentUrl"
          label="当前页面url"
          rules={[{ required: true, message: "请输入当前页面url" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="currentTitle"
          label="当前页面标题"
          rules={[{ required: true, message: "请输入当前页面标题" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="currentDescription"
          label="读后感评价和描述"
          rules={[{ required: true, message: "请输入读后感评价和描述" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="targetFolder"
          label="保存目标文件夹"
          rules={[{ required: true, message: "请输入保存目标文件夹" }]}
        >
          <ApiSelect />
        </Form.Item>
        <Row justify="end">
          <Space size="middle">
            <Button>取消</Button>
            <Button type="primary" onClick={handleSave}>
              保存
            </Button>
          </Space>
        </Row>
      </Form>
    </Card>
  );
};

export default Popup;

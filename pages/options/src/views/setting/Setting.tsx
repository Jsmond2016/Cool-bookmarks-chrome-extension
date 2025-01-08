import { Button, Col, Form, Layout, Row } from 'antd';
import React from 'react';

import { FormItem } from '@extension/components';
import CategoryInput from './components/CategoryInput';
import BindCategory from './components/BindCategory';

const Setting = () => {
  const [form] = Form.useForm();

  const handleSave = async () => {
    // form.submit();
    const values = await form.validateFields();
    console.log('values', values);
  };

  return (
    <Layout.Content>
      <Form form={form}>
        <Row>
          <Col push={4} span={12}>
            <FormItem name="firstCategory" label="一级分类" initialValue={[{ value: '', label: '' }]}>
              <CategoryInput />
            </FormItem>
            <FormItem name="secondCategory" label="二级分类" initialValue={[{ value: '', label: '' }]}>
              <CategoryInput />
            </FormItem>
            <Form.Item
              noStyle
              shouldUpdate={(pre, cur) =>
                pre.firstCategory !== cur.firstCategory || pre.secondCategory !== cur.secondCategory
              }>
              {({ getFieldValue }) => {
                const firstCategoryOptions = getFieldValue('firstCategory') || [];
                const secondCategoryOptions = getFieldValue('secondCategory') || [];
                return (
                  <FormItem name="bindCategory">
                    <BindCategory
                      firstCategoryOptions={firstCategoryOptions}
                      secondCategoryOptions={secondCategoryOptions}
                    />
                  </FormItem>
                );
              }}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col push={4}>
            <Button type="primary" onClick={handleSave}>
              提交
            </Button>
          </Col>
        </Row>
      </Form>
    </Layout.Content>
  );
};

export default Setting;

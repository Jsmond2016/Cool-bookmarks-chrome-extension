import { Button, Form, Layout } from 'antd';
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
        <FormItem name="firstCategory" label="一级分类" initialValue={[{ name: '', label: '' }]}>
          <CategoryInput />
        </FormItem>
        <FormItem name="secondCategory" label="二级分类" initialValue={[{ name: '', label: '' }]}>
          <CategoryInput />
        </FormItem>
        <Form.Item noStyle>
          {({ getFieldValue }) => (
            <FormItem name="bindCategory">
              <BindCategory
                firstCategoryOptions={getFieldValue('firstCategory') || []}
                secondCategoryOptions={(getFieldValue('secondCategory') || []).map(v => ({
                  label: v.name,
                  value: v.name,
                }))}
              />
            </FormItem>
          )}
        </Form.Item>
        <Button type="primary" onClick={handleSave}>
          提交
        </Button>
      </Form>
    </Layout.Content>
  );
};

export default Setting;

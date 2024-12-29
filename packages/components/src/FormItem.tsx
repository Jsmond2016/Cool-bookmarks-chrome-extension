import React from 'react';
import type { FormItemProps } from 'antd';
import { Form } from 'antd';

export const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const FormItem = ({ label, name, children }: Pick<FormItemProps, 'label' | 'name' | 'children'>) => (
  <Form.Item {...formItemLayout} label={label} name={name}>
    {children}
  </Form.Item>
);

export default FormItem;

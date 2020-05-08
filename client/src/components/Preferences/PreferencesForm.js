import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Tooltip, Button, Input, Switch } from 'antd';
import { formItemLayout, formItemLayoutWithoutLabel } from './utils.js';

const PreferencesForm = ({ fields }) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onFinish = values => {
    console.log(values);
  };

  return (
    <Form {...layout} form={form} onFinish={onFinish}>
      <Form.Item name="displayName" label="Display Name">
        <Input />
      </Form.Item>
    </Form>
  );
};

export default PreferencesForm;

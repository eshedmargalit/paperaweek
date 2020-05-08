import React from 'react';
import { Tooltip, Icon, Button, Input, Form, Switch } from 'antd';
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

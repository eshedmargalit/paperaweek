import React, { useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Switch, Form } from 'antd';
import { formItemLayout } from './utils.js';
import './PreferencesForm.scss';

export default function PreferencesForm({ initialValues, saveResults }) {
  const [form] = Form.useForm();
  const initialProfileText = initialValues.publicProfile ? 'is publicly visible' : 'is not publicly visible';

  const [profileText, setProfileText] = useState(initialProfileText);

  const onValuesChange = (values) => {
    const newText = values.publicProfile ? 'is publicly visible' : 'is not publicly visible';
    setProfileText(newText);

    saveResults(values);
  };

  return (
    <Form
      {...formItemLayout}
      onValuesChange={onValuesChange}
      layout="horizontal"
      labelAlign="left"
      form={form}
      initialValues={initialValues}
    >
      <Form.Item name="publicProfile" label="Make Profile Public?" valuePropName="checked">
        <Switch />
      </Form.Item>
      Your profile
      {' '}
      {profileText}
      !
    </Form>
  );
}

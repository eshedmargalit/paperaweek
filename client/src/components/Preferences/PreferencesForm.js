import React, { useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Switch, Form } from 'antd';
import { formItemLayout, formItemLayoutWithoutLabel } from './utils.js';
import './PreferencesForm.scss';

const PreferencesForm = ({ initialValues, profileId }) => {
  const [form] = Form.useForm();
  const initialProfileUrlColor = initialValues.publicProfile ? '#222' : '#bbb';
  const [profileUrlColor, setProfileColor] = useState(initialProfileUrlColor);

  const onFinish = values => {
    console.log(values);
  };

  const onPublicToggle = isPublic => {
    const newColor = isPublic ? '#222' : '#bbb';
    setProfileColor(newColor);
  };

  const profileUrl = `${window.location.origin}/profiles/${profileId}`;

  return (
    <Form {...formItemLayout} form={form} onFinish={onFinish} initialValues={initialValues}>
      <Form.Item name="displayName" label="Display Name">
        <Input />
      </Form.Item>
      <Form.Item name="publicProfile" label="Make Profile Public?" valuePropName="checked">
        <div style={{ display: 'flex' }}>
          <div>
            <Switch onChange={onPublicToggle} />
          </div>
          <div className="profileUrl" style={{ color: profileUrlColor }}>
            {profileUrl}
          </div>
        </div>
      </Form.Item>
      <Form.Item {...formItemLayoutWithoutLabel} name="displayName">
        <Button type="primary" htmlType="submit">
          Save Preferences
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PreferencesForm;

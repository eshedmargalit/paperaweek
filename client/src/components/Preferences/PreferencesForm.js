import React, { useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Switch, Spin, Form } from 'antd';
import { formItemLayout, formItemLayoutWithoutLabel } from './utils.js';
import './PreferencesForm.scss';

const PreferencesForm = ({ initialValues, profileId, onFinish, updating }) => {
  const [form] = Form.useForm();
  const initialProfileUrlColor = initialValues.publicProfile ? '#222' : '#bbb';
  const initialProfileText = initialValues.publicProfile ? 'will be publicly visible' : 'will not be publicly visible';

  const [profileUrlColor, setProfileColor] = useState(initialProfileUrlColor);
  const [profileText, setProfileText] = useState(initialProfileText);

  const onPublicToggle = isPublic => {
    const newColor = isPublic ? '#222' : '#bbb';
    const newText = isPublic ? 'will be publicly visible' : 'will not be publicly visible';
    setProfileColor(newColor);
    setProfileText(newText);
  };

  const profileUrl = `${window.location.origin}/profiles/${profileId}`;
  const buttonContent = updating ? (
    <div>
      Saving <Spin />
    </div>
  ) : (
    'Save Changes'
  );

  return (
    <div className="width80">
      <Form {...formItemLayout} layout="vertical" form={form} onFinish={onFinish} initialValues={initialValues}>
        <Form.Item name="displayName" label="Display Name">
          <Input />
        </Form.Item>
        <Form.Item name="publicProfile" label="Make Profile Public?" valuePropName="checked">
          <Switch onChange={onPublicToggle} />
        </Form.Item>
        <div className="profileUrl" style={{ color: profileUrlColor }}>
          {profileUrl}
          {` `}
          {profileText}
        </div>
        <hr />
        <Form.Item {...formItemLayoutWithoutLabel} name="displayName">
          <Button type="secondary" htmlType="submit">
            {buttonContent}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PreferencesForm;

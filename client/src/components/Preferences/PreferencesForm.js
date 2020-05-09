import React, { useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Switch, Form } from 'antd';
import { formItemLayout } from './utils.js';
import './PreferencesForm.scss';

const PreferencesForm = ({ initialValues, profileId, saveResults }) => {
  const [form] = Form.useForm();
  const initialProfileUrlColor = initialValues.publicProfile ? '#222' : '#bbb';
  const initialProfileText = initialValues.publicProfile ? 'is publicly visible' : 'is not publicly visible';

  const [profileUrlColor, setProfileColor] = useState(initialProfileUrlColor);
  const [profileText, setProfileText] = useState(initialProfileText);

  const onValuesChange = values => {
    const newColor = values.publicProfile ? '#222' : '#bbb';
    const newText = values.publicProfile ? 'is publicly visible' : 'is not publicly visible';
    setProfileColor(newColor);
    setProfileText(newText);

    saveResults(values);
  };

  const profileUrl = `${window.location.origin}/profiles/${profileId}`;

  return (
    <Form
      {...formItemLayout}
      onValuesChange={onValuesChange}
      layout="vertical"
      form={form}
      initialValues={initialValues}
    >
      <Form.Item name="publicProfile" label="Make Profile Public?" valuePropName="checked">
        <Switch />
      </Form.Item>
      <div className="profileUrl" style={{ color: profileUrlColor }}>
        <a href={profileUrl} target="_blank">
          {profileUrl}
        </a>
        {` `}
        {profileText}
      </div>
      <hr />
    </Form>
  );
};

export default PreferencesForm;

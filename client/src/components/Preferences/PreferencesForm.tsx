import React, { useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Switch, Form } from 'antd';
import { formItemLayout } from './utils';
import './PreferencesForm.scss';
import { PreferenceFormValues } from './types';

export interface PreferencesFormProps {
  initialValues: PreferenceFormValues;
  saveResults: (values: PreferenceFormValues) => void;
}

export default function PreferencesForm({ initialValues, saveResults }: PreferencesFormProps): JSX.Element {
  const [form] = Form.useForm();
  const initialProfileText = initialValues.publicProfile ? 'is publicly visible' : 'is not publicly visible';

  const [profileText, setProfileText] = useState<string>(initialProfileText);

  const onValuesChange = (values: PreferenceFormValues) => {
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
      Your profile {profileText}!
    </Form>
  );
}

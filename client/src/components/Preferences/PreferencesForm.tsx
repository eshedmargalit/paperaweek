import React from 'react';
import '@ant-design/compatible/assets/index.css';
import { Switch, Card } from 'antd';
import './PreferencesForm.scss';
import { Formik } from 'formik';
import { PreferenceFormValues } from './types';

export interface PreferencesFormProps {
  initialValues: PreferenceFormValues;
  saveResults: (values: PreferenceFormValues) => void;
}

function PrivacyExplainer(): JSX.Element {
  return <div>Yo shit secure, dawg</div>;
}

export default function PreferencesForm({ initialValues, saveResults }: PreferencesFormProps): JSX.Element {
  const onSubmit = (values: PreferenceFormValues) => {
    saveResults(values);
  };

  return (
    <Formik layout="vertical" onSubmit={onSubmit} initialValues={initialValues}>
      {({ submitForm, values, setFieldValue }) => (
        <div className="preferences-form">
          <div className="section-title flex">
            <h2>Your Profile</h2>
            <div className="flex toggle-public">
              <p>Make Public?</p>
              <Switch
                checked={values.publicProfile}
                onChange={() => {
                  setFieldValue('publicProfile', !values.publicProfile);
                  submitForm();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
}

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
          <Card className="preferences-form__card">
            <h2>Is Profile Public</h2>
            <Switch
              checked={values.publicProfile}
              onChange={() => {
                setFieldValue('publicProfile', !values.publicProfile);
                submitForm();
              }}
            />
          </Card>
          {values.publicProfile ? (
            <div className="section-title">
              <h2>Your Public Profile</h2>
            </div>
          ) : (
            <PrivacyExplainer />
          )}
        </div>
      )}
    </Formik>
  );
}

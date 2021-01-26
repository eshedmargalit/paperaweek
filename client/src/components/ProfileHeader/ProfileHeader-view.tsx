import React from 'react';
import '@ant-design/compatible/assets/index.css';
import { Switch } from 'antd';
import './ProfileHeader.scss';
import { Formik } from 'formik';
import { ProfileHeaderValues } from './types';
import { Profile } from '../../types';

export interface ProfileHeaderProps {
  initialValues: ProfileHeaderValues;
  saveResults: (values: ProfileHeaderValues) => void;
  isOwnPage: Profile['isOwnPage'];
  userDisplayName: Profile['userDisplayName'];
}

export default function ProfileHeader({
  initialValues,
  saveResults,
  isOwnPage,
  userDisplayName,
}: ProfileHeaderProps): JSX.Element {
  const onSubmit = (values: ProfileHeaderValues) => {
    saveResults(values);
  };

  let headerText = 'Your Profile';
  if (!isOwnPage) {
    if (userDisplayName === '') {
      headerText = 'Private Profile';
    } else {
      headerText = `${userDisplayName}'s Profile`;
    }
  }

  return (
    <Formik onSubmit={onSubmit} initialValues={initialValues}>
      {({ submitForm, values, setFieldValue }) => (
        <div className="profile-header">
          <p>{isOwnPage}</p>
          <div className="section-title flex">
            <h2>{headerText}</h2>
            {isOwnPage && (
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
            )}
          </div>
        </div>
      )}
    </Formik>
  );
}

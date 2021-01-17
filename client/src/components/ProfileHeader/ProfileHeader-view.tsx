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

// function PrivacyExplainer(): JSX.Element {
//   return <div>Yo shit secure, dawg</div>;
// }

export default function ProfileHeader({
  initialValues,
  saveResults,
  isOwnPage,
  userDisplayName,
}: ProfileHeaderProps): JSX.Element {
  const onSubmit = (values: ProfileHeaderValues) => {
    saveResults(values);
  };

  return (
    <Formik onSubmit={onSubmit} initialValues={initialValues}>
      {({ submitForm, values, setFieldValue }) => (
        <div className="profile-header">
          <p>{isOwnPage}</p>
          <div className="section-title flex">
            <h2>{isOwnPage ? 'Your Profile' : `${userDisplayName}'s Profile`}</h2>
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

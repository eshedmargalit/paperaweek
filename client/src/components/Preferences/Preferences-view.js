import React from 'react';
import NotFound from '../NotFound/NotFound';
import PreferencesForm from './PreferencesForm';

function PreferencesView({ auth, initialValues, profileId, updating, onFinish }) {
  const form = (
    <PreferencesForm updating={updating} initialValues={initialValues} profileId={profileId} onFinish={onFinish} />
  );
  return auth ? form : <NotFound />;
}

export default PreferencesView;

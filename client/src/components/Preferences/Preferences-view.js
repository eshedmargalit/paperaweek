import React from 'react';
import NotFound from '../NotFound/NotFound';
import PreferencesForm from './PreferencesForm';

function PreferencesView({ auth, initialValues, profileId }) {
  return auth ? <PreferencesForm initialValues={initialValues} profileId={profileId} /> : <NotFound />;
}

export default PreferencesView;

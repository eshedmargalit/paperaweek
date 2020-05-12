import React from 'react';
import NotFound from '../NotFound/NotFound';
import PreferencesForm from './PreferencesForm';

function PreferencesView({ auth, initialValues, profileId, updating, saveResults }) {
  const form = (
    <PreferencesForm
      updating={updating}
      initialValues={initialValues}
      profileId={profileId}
      saveResults={saveResults}
    />
  );
  return auth ? form : <NotFound />;
}

export default PreferencesView;

import React from 'react';
import NotFound from '../NotFound/NotFound';
import PreferencesForm from './PreferencesForm';

function PreferencesView({ auth, settings }) {
  // TODO: make a form out of settings
  console.log(settings);

  return auth ? <PreferencesForm fields={settings} /> : <NotFound />;
}

export default PreferencesView;

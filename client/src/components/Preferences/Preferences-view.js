import React from 'react';
import NotFound from '../NotFound/NotFound';
import PreferencesForm from './PreferencesForm';

export default function PreferencesView({ auth, initialValues, updating, saveResults }) {
  const form = <PreferencesForm updating={updating} initialValues={initialValues} saveResults={saveResults} />;
  return auth ? form : <NotFound />;
}

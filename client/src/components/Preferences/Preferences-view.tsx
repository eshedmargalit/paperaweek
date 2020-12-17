import React from 'react';
import { User } from '../../types';
import NotFound from '../NotFound/NotFound';
import PreferencesForm, { PreferencesFormProps } from './PreferencesForm';

export interface PreferencesViewProps extends PreferencesFormProps {
  auth: User;
}

export default function PreferencesView({ auth, initialValues, saveResults }: PreferencesViewProps): JSX.Element {
  if (!auth) {
    return <NotFound />;
  }

  return <PreferencesForm initialValues={initialValues} saveResults={saveResults} />;
}

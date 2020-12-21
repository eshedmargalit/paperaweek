import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import PreferencesContainer from './Preferences-container';
import { RootState } from '../../reducers';
import { User } from '../../types';
import { PreferenceFormValues } from './types';

interface PreferencesReduxProps {
  onChange: () => void;
}

export default function PreferencesRedux({ onChange }: PreferencesReduxProps): JSX.Element {
  const saveResults = async (values: PreferenceFormValues) => {
    await axios.put('/api/user', values);
    onChange();
  };

  const auth: User = useSelector((state: RootState) => state.auth);
  const user: User = useSelector((state: RootState) => state.user);

  const { publicProfile } = user;
  const initialValues = { publicProfile };

  return <PreferencesContainer auth={auth} initialValues={initialValues} saveResults={saveResults} />;
}

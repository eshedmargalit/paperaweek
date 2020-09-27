import React from 'react';
import { useSelector } from 'react-redux';
import PreferencesContainer from './Preferences-container';
import axios from 'axios';

export default function PreferencesRedux({ onChange }) {
  const saveResults = async values => {
    await axios.put('/api/user', values);
    onChange();
  };
  const auth = useSelector(state => state.auth);
  const user = useSelector(state => state.user);

  let { publicProfile } = user;
  const initialValues = { publicProfile };

  return <PreferencesContainer auth={auth} initialValues={initialValues} saveResults={saveResults} />;
}

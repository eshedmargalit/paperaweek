import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '../../reducers';
import { Maybe, Profile } from '../../types';
import { ProfileHeaderValues } from './types';
import ProfileHeader from './ProfileHeader-view';
import { AuthState } from '../../reducers/reducer_auth';

interface ProfileHeaderReduxProps {
  onChange: () => void;
  isOwnPage: Profile['isOwnPage'];
  userDisplayName: Profile['userDisplayName'];
}

export default function PreferencesRedux({
  onChange,
  isOwnPage,
  userDisplayName,
}: ProfileHeaderReduxProps): Maybe<JSX.Element> {
  const saveResults = async (values: ProfileHeaderValues) => {
    await axios.put('/api/user', values);
    onChange();
  };

  const {
    user: { publicProfile },
    loading,
  }: AuthState = useSelector((state: RootState) => state.auth);

  if (loading) {
    return null;
  }

  const initialValues = { publicProfile };

  return (
    <ProfileHeader
      initialValues={initialValues}
      saveResults={saveResults}
      isOwnPage={isOwnPage}
      userDisplayName={userDisplayName}
    />
  );
}

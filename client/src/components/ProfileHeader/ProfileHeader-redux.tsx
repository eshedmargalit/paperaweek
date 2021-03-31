import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '../../reducers';
import { Maybe, Profile } from '../../types';
import ProfileHeader from './ProfileHeader-view';
import { AuthState } from '../../reducers/reducer_auth';

export interface ProfileHeaderReduxProps {
  onChange: () => void;
  isOwnPage: Profile['isOwnPage'];
  userDisplayName: Profile['userDisplayName'];
}

export default function PreferencesRedux({
  onChange,
  isOwnPage,
  userDisplayName,
}: ProfileHeaderReduxProps): Maybe<JSX.Element> {
  const [toggleLoading, setToggleLoading] = useState(false);

  const updateIsPublic = async (isPublic: boolean) => {
    setToggleLoading(true);
    await axios.put('/api/user', { publicProfile: isPublic });
    onChange();
    setToggleLoading(false);
  };

  const {
    user: { publicProfile },
    loading,
  }: AuthState = useSelector((state: RootState) => state.auth);

  if (loading) {
    return null;
  }

  return (
    <ProfileHeader
      isPublic={publicProfile}
      onChange={updateIsPublic}
      isOwnPage={isOwnPage}
      userDisplayName={userDisplayName}
      toggleLoading={toggleLoading}
    />
  );
}

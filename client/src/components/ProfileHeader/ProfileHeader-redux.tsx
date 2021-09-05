import React, { useState } from 'react';
import axios from 'axios';
import { Maybe, Profile } from '../../types';
import ProfileHeader from './ProfileHeader-view';
import { AuthState } from '../../slices/authSlice';
import { useAppSelector } from '../../hooks/reduxHooks';

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
  const [switchLoading, setSwitchLoading] = useState(false);

  const updateIsPublic = async (isPublic: boolean) => {
    setSwitchLoading(true);
    await axios.put('/api/user', { publicProfile: isPublic });
    onChange();
    setSwitchLoading(false);
  };

  const {
    user: { publicProfile },
    loading,
  }: AuthState = useAppSelector((state) => state.auth);

  if (loading) {
    return null;
  }

  return (
    <ProfileHeader
      isPublic={publicProfile}
      onChange={updateIsPublic}
      isOwnPage={isOwnPage}
      userDisplayName={userDisplayName}
      switchLoading={switchLoading}
    />
  );
}

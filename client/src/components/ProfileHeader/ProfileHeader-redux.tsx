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
  const [downloadLoading, setDownloadLoading] = useState(false);

  const updateIsPublic = async (isPublic: boolean) => {
    setSwitchLoading(true);
    await axios.put('/api/user', { publicProfile: isPublic });
    onChange();
    setSwitchLoading(false);
  };

  const downloadData = async () => {
    setDownloadLoading(true);
    try {
      const response = await axios.get('/api/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `paperaweek-export-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download data:', error);
    } finally {
      setDownloadLoading(false);
    }
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
      onDownload={downloadData}
      isOwnPage={isOwnPage}
      userDisplayName={userDisplayName}
      switchLoading={switchLoading}
      downloadLoading={downloadLoading}
    />
  );
}

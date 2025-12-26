import React from 'react';
import { Switch } from 'antd';
import './ProfileHeader.scss';
import { Profile } from '../../types';

export interface ProfileHeaderProps {
  isPublic: boolean;
  onChange: (e: boolean) => void;
  isOwnPage: Profile['isOwnPage'];
  userDisplayName: Profile['userDisplayName'];
  switchLoading: boolean;
}

export default function ProfileHeader({
  isPublic,
  onChange,
  isOwnPage,
  userDisplayName,
  switchLoading,
}: ProfileHeaderProps): JSX.Element {
  let headerText = 'Your Profile';
  if (!isOwnPage) {
    if (userDisplayName === '') {
      headerText = 'Private Profile';
    } else {
      headerText = `${userDisplayName}'s Profile`;
    }
  }

  return (
    <div className="profile-header">
      <p>{isOwnPage}</p>
      <div className="section-title flex">
        <h2>{headerText}</h2>
        {isOwnPage && (
          <div className="flex toggle-public">
            <p>Make Public?</p>
            <Switch loading={switchLoading} defaultChecked={isPublic} onChange={onChange} />
          </div>
        )}
      </div>
    </div>
  );
}

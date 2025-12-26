import React from 'react';
import { Switch, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import './ProfileHeader.scss';
import { Profile } from '../../types';

export interface ProfileHeaderProps {
  isPublic: boolean;
  onChange: (e: boolean) => void;
  onDownload: () => void;
  isOwnPage: Profile['isOwnPage'];
  userDisplayName: Profile['userDisplayName'];
  switchLoading: boolean;
  downloadLoading: boolean;
}

export default function ProfileHeader({
  isPublic,
  onChange,
  onDownload,
  isOwnPage,
  userDisplayName,
  switchLoading,
  downloadLoading,
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
          <div className="flex profile-actions">
            <div className="flex toggle-public">
              <p>Make Public?</p>
              <Switch loading={switchLoading} defaultChecked={isPublic} onChange={onChange} />
            </div>
            <Button
              className="download-data-btn"
              icon={<DownloadOutlined />}
              loading={downloadLoading}
              onClick={onDownload}
            >
              Download My Data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

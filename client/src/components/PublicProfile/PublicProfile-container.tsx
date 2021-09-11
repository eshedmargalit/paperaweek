import { notification } from 'antd';
import React from 'react';
import { Review } from '../../types';
import PublicProfileView, { PublicProfileViewProps } from './PublicProfile-view';

interface PublicProfileContainerProps extends Omit<PublicProfileViewProps, 'handleModalCopy'> {
  userId: string;
}

const openSuccessfulCopyNotification = () => {
  notification.success({
    message: 'Link Copied!',
  });
};

export default function PublicProfileContainer(props: PublicProfileContainerProps): JSX.Element {
  const handleModalCopy = (review: Review) => {
    const link = `${window.location.origin}/profiles/${props.userId}/${review._id}`;
    navigator.clipboard.writeText(link);
    openSuccessfulCopyNotification();
  };

  return <PublicProfileView {...props} handleModalCopy={handleModalCopy} />;
}

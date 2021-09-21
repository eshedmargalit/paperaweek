import React from 'react';
import { makeHandleModalCopy } from '../utils';
import PublicProfileView, { PublicProfileViewProps } from './PublicProfile-view';

interface PublicProfileContainerProps extends Omit<PublicProfileViewProps, 'handleModalCopy'> {
  userId: string;
}

export default function PublicProfileContainer(props: PublicProfileContainerProps): JSX.Element {
  const handleModalCopy = makeHandleModalCopy(props.userId);

  return <PublicProfileView {...props} handleModalCopy={handleModalCopy} />;
}

import React from 'react';
import PublicProfileView, { PublicProfileViewProps } from './PublicProfile-view';

type PublicProfileContainerProps = PublicProfileViewProps;

export default function PublicProfileContainer(props: PublicProfileContainerProps): JSX.Element {
  return <PublicProfileView {...props} />;
}

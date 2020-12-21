import React from 'react';
import HomeView, { HomeViewProps } from './Home-view';

// These are the same, for now. If they ever change, replace this alias.
type HomeContainerProps = HomeViewProps;

export default function HomeContainer(props: HomeContainerProps): JSX.Element {
  return <HomeView {...props} />;
}

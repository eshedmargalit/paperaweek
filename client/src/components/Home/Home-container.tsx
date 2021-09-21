import React from 'react';
import HomeView, { HomeViewProps } from './Home-view';

type HomeContainerProps = HomeViewProps;

export default function HomeContainer(props: HomeContainerProps): JSX.Element {
  return <HomeView {...props} />;
}

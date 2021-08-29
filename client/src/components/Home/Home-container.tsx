import React from 'react';
import HomeView, { HomeViewProps } from './Home-view';

type HomeContainerProps = HomeViewProps;

export default function HomeContainer({ showTour }: HomeContainerProps): JSX.Element {
  return <HomeView showTour={showTour} />;
}

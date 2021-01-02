import React from 'react';
import { useProtected } from '../../hooks/useProtected';
import HomeContainer from './Home-container';

export default function HomeRedux(): JSX.Element {
  useProtected();
  return <HomeContainer />;
}

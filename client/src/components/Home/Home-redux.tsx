import React from 'react';
import { Spin } from 'antd';
import { useProtected } from '../../hooks';
import HomeContainer from './Home-container';
import { useAppSelector } from '../../hooks/reduxHooks';

export default function HomeRedux(): JSX.Element {
  useProtected();
  const { loading } = useAppSelector((state) => state.auth);
  const { showTour } = useAppSelector((state) => state.user);

  return (
    <Spin spinning={loading}>
      <HomeContainer showTour={showTour} />
    </Spin>
  );
}

import React from 'react';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';
import { useProtected } from '../../hooks';
import HomeContainer from './Home-container';
import { RootState } from '../../reducers';
import { AuthState } from '../../reducers/reducer_auth';

export default function HomeRedux(): JSX.Element {
  useProtected();
  const { loading }: AuthState = useSelector((state: RootState) => state.auth);
  const { showTour } = useSelector((state: RootState) => state.user);

  return (
    <Spin spinning={loading}>
      <HomeContainer showTour={showTour} />
    </Spin>
  );
}

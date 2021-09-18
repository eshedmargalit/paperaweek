import React from 'react';
import { Spin } from 'antd';
import { useProtected } from '../../hooks';
import HomeContainer from './Home-container';
import { useAppSelector } from '../../hooks/reduxHooks';
import { Review } from '../../types';

const MIN_REVIEWS_FOR_ROTD = 5;

export default function HomeRedux(): JSX.Element {
  useProtected();
  const { loading } = useAppSelector((state) => state.auth);
  const { showTour } = useAppSelector((state) => state.user);
  const reviewList: Review[] = useAppSelector((state) => state.reviews.reviewList);
  const showReviewOfTheDay = reviewList.length >= MIN_REVIEWS_FOR_ROTD;

  return (
    <Spin spinning={loading}>
      <HomeContainer showTour={showTour} showReviewOfTheDay={showReviewOfTheDay} />
    </Spin>
  );
}

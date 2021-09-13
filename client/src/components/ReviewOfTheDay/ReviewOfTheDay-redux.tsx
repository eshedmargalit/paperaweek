import React from 'react';
import moment from 'moment';

import { Review } from '../../types';

import ReviewOfTheDayContainer from './ReviewOfTheDay-container';
import { useAppSelector } from '../../hooks/reduxHooks';

const MIN_REVIEWS_FOR_ROTD = 5;

const pickROTD = (reviews: Review[]): Review => {
  const dateInt = parseInt(moment().format('YYYYMMDD'), 10);
  return reviews[dateInt % reviews.length];
};

export default function ReviewOfTheDayRedux(): JSX.Element {
  const reviewList: Review[] = useAppSelector((state) => state.reviews.reviewList);
  if (reviewList.length < MIN_REVIEWS_FOR_ROTD) {
    return <></>;
  }

  const rotd = pickROTD(reviewList);

  return <ReviewOfTheDayContainer rotd={rotd} />;
}

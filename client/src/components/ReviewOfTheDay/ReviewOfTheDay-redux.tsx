import React from 'react';
import moment from 'moment';

import { Review } from '../../types';

import ReviewOfTheDayContainer from './ReviewOfTheDay-container';
import { useAppSelector } from '../../hooks/reduxHooks';
import { hashString } from '../utils';

const pickROTD = (reviews: Review[]): Review | undefined => {
  const dateInt = hashString(moment().format('YYYYMMDD'));
  return reviews[dateInt % reviews.length];
};

export default function ReviewOfTheDayRedux(): JSX.Element | null {
  const reviewList: Review[] = useAppSelector((state) => state.reviews.reviewList);

  const rotd = pickROTD(reviewList);

  // This could happen if somebody accidentally tries to render this with an empty review list
  // The home page doesn't show this component if that's the case, so this is just future-proofing
  if (!rotd) {
    return null;
  }

  return <ReviewOfTheDayContainer rotd={rotd} />;
}

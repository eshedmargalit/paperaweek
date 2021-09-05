import React from 'react';
import { blankReview } from '../../templates';
import StatBoxView from './StatBox-view';
import { Review } from '../../types';
import { setActiveReview } from '../../slices/activeReviewSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';

export default function StatBoxRedux(): JSX.Element {
  const dispatch = useAppDispatch();
  const reviews: Review[] = useAppSelector((state) => state.reviews.reviewList);

  const setBlankReview = () => {
    dispatch(setActiveReview(blankReview));
  };

  return <StatBoxView reviews={reviews} setBlankReview={setBlankReview} />;
}

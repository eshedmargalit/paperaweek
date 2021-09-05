import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../slices';
import { blankReview } from '../../templates';
import StatBoxView from './StatBox-view';
import { Review } from '../../types';
import { setActiveReview } from '../../slices/activeReviewSlice';

export default function StatBoxRedux(): JSX.Element {
  const dispatch = useDispatch();
  const reviews: Review[] = useSelector((state: RootState) => state.reviews.reviewList);

  const setBlankReview = () => {
    dispatch(setActiveReview(blankReview));
  };

  return <StatBoxView reviews={reviews} setBlankReview={setBlankReview} />;
}

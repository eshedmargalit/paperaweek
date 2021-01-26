import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReview } from '../../actions';
import { RootState } from '../../reducers';
import { blankReview } from '../../templates';
import StatBoxView from './StatBox-view';
import { Review } from '../../types';

export default function StatBoxRedux(): JSX.Element {
  const dispatch = useDispatch();
  const reviews: Review[] = useSelector((state: RootState) => state.reviews.reviewList);

  const setBlankReview = () => {
    dispatch(setReview(blankReview));
  };

  return <StatBoxView reviews={reviews} setBlankReview={setBlankReview} />;
}

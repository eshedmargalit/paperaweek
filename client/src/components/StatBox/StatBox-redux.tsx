import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReview } from '../../actions';
import { RootState } from '../../reducers';
import { blankReview } from '../../templates';
import StatBoxView from './StatBox-view';

export default function StatBoxRedux() {
  const dispatch = useDispatch();
  const reviews = useSelector((state: RootState) => state.reviews.reviewList);

  const setBlankReview = () => {
    dispatch(setReview(blankReview));
  };

  return <StatBoxView reviews={reviews} setBlankReview={setBlankReview} />;
}

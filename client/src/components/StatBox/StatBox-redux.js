import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatBoxContainer from './StatBox-container';
import { setReview } from '../../actions';

export default function StatBoxRedux() {
  const dispatch = useDispatch();
  const reviewList = useSelector(state => state.reviews.reviewList);

  const startBlankReview = () => {
    dispatch(setReview(null, null));
  };

  return <StatBoxContainer reviews={reviewList} startBlankReview={startBlankReview} />;
}

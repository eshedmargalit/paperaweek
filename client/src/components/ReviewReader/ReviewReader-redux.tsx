import React from 'react';
import axios from 'axios';
import { PageHeaderProps } from '../utils/PageHeader';
import { fetchUser } from '../../actions';
import SearchableReviewDisplay from '../SearchableReviewDisplay';
import { Review, User } from '../../types';
import { makeHandleModalCopy } from '../utils';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setActiveReview } from '../../slices/activeReviewSlice';

export default function ReviewReaderRedux(): JSX.Element {
  const dispatch = useAppDispatch();
  const user: User = useAppSelector((state) => state.user);

  const reviewList: Review[] = useAppSelector((state) => state.reviews.reviewList);
  const { demoMode } = useAppSelector((state) => state.auth);

  const deleteReview = async (reviewToDelete: Review) => {
    // remove the review from the Users list
    await axios.delete(`/api/reviews/${reviewToDelete._id}`);
    dispatch(fetchUser());
  };

  const populateFormWithReview = (review: Review) => {
    dispatch(setActiveReview(review));
  };

  const copyReviewURLToClipboard = makeHandleModalCopy(user.googleId);

  const pageHeaderProps: PageHeaderProps = { title: 'Your Reviews' };
  return (
    <SearchableReviewDisplay
      reviews={reviewList}
      deleteItemFunc={deleteReview}
      handleModalEdit={populateFormWithReview}
      handleModalCopy={copyReviewURLToClipboard}
      pageHeaderProps={pageHeaderProps}
      allowCopy={!demoMode}
      allowMutate={!demoMode}
    />
  );
}

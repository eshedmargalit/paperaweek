import React from 'react';
import axios from 'axios';
import { notification } from 'antd';
import { PageHeaderProps } from 'antd/lib/page-header';
import { fetchUser } from '../../actions';
import SearchableReviewDisplay from '../SearchableReviewDisplay';
import { Review, User } from '../../types';
import { setActiveReview } from '../../slices/activeReviewSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';

const openSuccessfulCopyNotification = () => {
  notification.success({
    message: 'Link Copied!',
  });
};

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

  const copyReviewURLToClipboard = (review: Review) => {
    const link = `${window.location.origin}/profiles/${user.googleId}/${review._id}`;
    navigator.clipboard.writeText(link);
    openSuccessfulCopyNotification();
  };

  const pageHeaderProps: PageHeaderProps = { title: 'Read Your Reviews' };
  return (
    <SearchableReviewDisplay
      reviews={reviewList}
      deleteItemFunc={deleteReview}
      handleModalEdit={populateFormWithReview}
      handleModalCopy={copyReviewURLToClipboard}
      pageHeaderProps={pageHeaderProps}
      hideButtons={demoMode}
    />
  );
}

import React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { notification } from 'antd';
import { PageHeaderProps } from 'antd/lib/page-header';
import { setReview, fetchUser } from '../../actions';
import SearchableReviewDisplay from '../SearchableReviewDisplay';
import { RootState } from '../../reducers';
import { Review, User } from '../../types';

const openSuccessfulCopyNotification = () => {
  notification.success({
    message: 'Link Copied!',
  });
};

export default function ReviewReaderRedux(): JSX.Element {
  const dispatch = useDispatch();
  const user: User = useSelector((state: RootState) => state.user);

  const reviewList: Review[] = useSelector((state: RootState) => state.reviews.reviewList);

  const deleteReview = async (reviewToDelete: Review) => {
    // remove the review from the Users list
    await axios.delete(`/api/reviews/${reviewToDelete._id}`);
    dispatch(fetchUser());
  };

  const populateFormWithReview = (review: Review) => {
    dispatch(setReview(review));
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
      hideFooter={false}
    />
  );
}

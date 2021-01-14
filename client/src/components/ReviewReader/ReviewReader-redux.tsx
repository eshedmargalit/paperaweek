import React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { notification } from 'antd';
import { PageHeaderProps } from 'antd/lib/page-header';
import { setReview, updateReviews } from '../../actions';
import SearchableReviewDisplay from '../SearchableReviewDisplay';
import { RootState } from '../../reducers';
import { Review, User } from '../../types';
import { LoadingReviewList } from '../../reducers/reducer_reviews';

const openSuccessfulCopyNotification = () => {
  notification.success({
    message: 'Link Copied!',
  });
};

export default function ReviewReaderRedux(): JSX.Element {
  const dispatch = useDispatch();
  const user: User = useSelector((state: RootState) => state.user);
  const loadingReviewList: LoadingReviewList = useSelector((state: RootState) => state.reviews);
  const { reviewList } = loadingReviewList;

  const deleteReview = (reviewToDelete: Review) => {
    const newReviews = reviewList.filter(rev => rev !== reviewToDelete);

    // update reviews in redux store
    dispatch(updateReviews(newReviews));

    // remove the review from the Users list
    axios.delete(`/api/reviews/${reviewToDelete._id}`);
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

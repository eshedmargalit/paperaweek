import React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { notification } from 'antd';
import { IconType } from 'antd/lib/notification';
import { PageHeaderProps } from 'antd/lib/page-header';
import { setReview, updateReviews } from '../../actions';
import SearchableReviewDisplay from '../SearchableReviewDisplay';
import { RootState } from '../../reducers';
import { Review, User } from '../../types';
import { LoadingReviewList } from '../../reducers/reducer_reviews';

const openNotificationWithIcon = (type: IconType) => {
  notification[type]({
    message: 'Link Copied!',
  });
};

export default function ReviewReaderRedux(): JSX.Element {
  const dispatch = useDispatch();
  const user: User = useSelector((state: RootState) => state.user);
  const loadingReviewList: LoadingReviewList = useSelector((state: RootState) => state.reviews);
  const { reviewList } = loadingReviewList;

  // TODO (in the future): loadingReviewList.loading can also be used to prevent showing "empty" data in the table. I don't think that's used right now...

  const deleteReview = (reviewToDelete: Review) => {
    const newReviews = reviewList.filter(rev => rev !== reviewToDelete);

    // update reviews in redux store
    dispatch(updateReviews(newReviews));

    // remove the review from the Users list
    axios.delete(`/api/papers/${reviewToDelete._id}`);
  };

  const handleModalEdit = (review: Review) => {
    dispatch(setReview(review));
  };

  const handleModalCopy = (review: Review) => {
    const link = `${window.location.origin}/profiles/${user.googleId}/${review._id}`;
    navigator.clipboard.writeText(link);
    openNotificationWithIcon('success');
  };

  const pageHeaderProps: PageHeaderProps = { title: 'Read Your Reviews' };
  return (
    <SearchableReviewDisplay
      reviews={reviewList}
      renderMath={user.renderMath}
      deleteItemFunc={deleteReview}
      handleModalEdit={handleModalEdit}
      handleModalCopy={handleModalCopy}
      pageHeaderProps={pageHeaderProps}
      hideFooter={false}
    />
  );
}

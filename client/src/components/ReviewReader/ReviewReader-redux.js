import React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setReview, updateReviews } from '../../actions';
import SearchableReviewDisplay from '../SearchableReviewDisplay';
import { notification } from 'antd';

const openNotificationWithIcon = type => {
  notification[type]({
    message: 'Link Copied!',
  });
};

export default function ReviewReaderRedux() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const reviews = useSelector(state => state.reviews);
  const { reviewList } = reviews;

  const deleteReview = reviewToDelete => {
    let newReviews = reviewList.filter(rev => {
      return rev !== reviewToDelete;
    });
    dispatch(updateReviews(newReviews));
    axios.delete(`/api/papers/${reviewToDelete._id}`);
  };

  const handleModalEdit = reviewContent => {
    dispatch(setReview(null, reviewContent));
  };

  const handleModalCopy = review => {
    const link = `${window.location.origin}/profiles/${user.googleId}/${review._id}`;
    navigator.clipboard.writeText(link);
    openNotificationWithIcon('success');
  };

  const pageHeaderProps = {
    pageHeaderTitle: 'Read Your Reviews',
    onPageBack: null,
  };
  return (
    <SearchableReviewDisplay
      reviews={reviewList}
      renderMath={user.renderMath}
      deleteItemFunc={deleteReview}
      handleModalEdit={handleModalEdit}
      handleModalCopy={handleModalCopy}
      pageHeaderProps={pageHeaderProps}
    />
  );
}

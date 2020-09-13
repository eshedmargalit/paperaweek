import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setReview, updateReviews } from '../../actions';
import SearchableReviewDisplay from '../SearchableReviewDisplay';
import { notification } from 'antd';

const openNotificationWithIcon = type => {
  notification[type]({
    message: 'Link Copied!',
  });
};

class ReviewReaderRedux extends Component {
  deleteReview = reviewToDelete => {
    let { reviews } = this.props;
    let { reviewList } = reviews;
    let newReviews = reviewList.filter(rev => {
      return rev !== reviewToDelete;
    });
    this.props.dispatch(updateReviews(newReviews));
    axios.delete(`/api/papers/${reviewToDelete._id}`);
  };

  handleModalEdit = reviewContent => {
    this.props.dispatch(setReview(null, reviewContent));
  };

  handleModalCopy = review => {
    const link = `${window.location.origin}/profiles/${this.props.user.googleId}/${review._id}`;
    navigator.clipboard.writeText(link);
    openNotificationWithIcon('success');
  };

  render() {
    let { reviews } = this.props;
    const pageHeaderProps = {
      pageHeaderTitle: 'Read Your Reviews',
      onPageBack: null,
    };
    return (
      <SearchableReviewDisplay
        reviews={reviews.reviewList}
        deleteReview={this.deleteReview}
        handleModalEdit={this.handleModalEdit}
        handleModalCopy={this.handleModalCopy}
        pageHeaderProps={pageHeaderProps}
      />
    );
  }
}

const mapStateToProps = ({ user, reviews }) => {
  return {
    user,
    reviews,
  };
};

export default connect(mapStateToProps, null)(ReviewReaderRedux);

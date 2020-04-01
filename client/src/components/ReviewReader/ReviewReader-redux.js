import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { startReview, updateReviews } from '../../actions';
import SearchableReviewDisplay from '../SearchableReviewDisplay';

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
    this.props.dispatch(startReview(null, reviewContent));
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
        pageHeaderProps={pageHeaderProps}
      />
    );
  }
}

const mapStateToProps = ({ reviews }) => {
  return {
    reviews,
  };
};

export default connect(
  mapStateToProps,
  null
)(ReviewReaderRedux);

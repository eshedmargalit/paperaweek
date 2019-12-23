import React, { Component } from 'react';
import { connect } from 'react-redux';
import { startReview, updateReviews } from '../../actions';
import ReviewReaderContainer from './ReviewReader-container';

class ReviewReaderRedux extends Component {
  deleteReview = reviewToDelete => {
    let { reviews, user } = this.props;
    let { reviewList } = reviews;
    let newReviews = reviewList.filter(rev => {
      return rev !== reviewToDelete;
    });
    this.props.dispatch(updateReviews(newReviews));

    let headers = {
      'content-type': 'application/json',
      userid: user.userid,
    };

    fetch('/api/papers', {
      method: 'delete',
      headers: headers,
      body: JSON.stringify(reviewToDelete),
    }).then(response => response.json());
  };

  handleModalEdit = reviewContent => {
    this.props.dispatch(startReview(null, reviewContent));
  };

  render() {
    let { user, reviews } = this.props;
    return (
      <ReviewReaderContainer
        reviews={reviews.reviewList}
        user={user}
        deleteReview={this.deleteReview}
        handleModalEdit={this.handleModalEdit}
      />
    );
  }
}

const mapStateToProps = ({ reviews, user }) => {
  return {
    reviews,
    user,
  };
};

export default connect(
  mapStateToProps,
  null
)(ReviewReaderRedux);

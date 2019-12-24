import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReviewWizardContainer from './ReviewWizard-container';
import { startReview, endReview, updateReadingList, updateReviews } from '../../actions/index';

class ReviewWizardRedux extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitLoading: false,
    };
  }

  onPageBack = () => {
    this.props.dispatch(endReview());
  };

  exitReview = () => {
    let { activeReview, readingList, user } = this.props;
    let { paperId } = activeReview;
    let newReadingList = readingList;
    if (paperId) {
      newReadingList = readingList.filter(currPaper => {
        return currPaper._id !== paperId;
      });
    }

    // update reading list in global state
    this.props.dispatch(updateReadingList(newReadingList));

    // update reading list in DB and re-update global state
    let headers = {
      'content-type': 'application/json',
      userid: user.userid,
    };
    fetch('/api/readingList', {
      method: 'put',
      headers: headers,
      body: JSON.stringify(newReadingList),
    })
      .then(response => response.json())
      .then(data => {
        this.props.dispatch(updateReadingList(data));
        this.props.dispatch(endReview());
      });
  };

  submitReview = (reviewObject, reviewId) => {
    let { user } = this.props;

    let fetchMethod = reviewId ? 'put' : 'post';
    let headers = {
      'content-type': 'application/json',
      userid: user.userid,
    };

    if (reviewId) {
      headers.id = reviewId;
    }

    this.setState({ submitLoading: true }, () => {
      fetch('/api/papers', {
        method: fetchMethod,
        headers: headers,
        body: JSON.stringify(reviewObject),
      })
        .then(response => response.json())
        .then(newReviewList => {
          this.props.dispatch(updateReviews(newReviewList));
          this.exitReview();
        });
    });
  };

  saveDraft = draft => {
    let { user } = this.props;

    // let fetchMethod = reviewId ? 'put' : 'post';
    let fetchMethod = 'post';
    let headers = {
      'content-type': 'application/json',
      userid: user.userid,
    };

    // if (reviewId) {
    //   headers.id = reviewId;
    // }

    return fetch('/api/drafts', {
      method: fetchMethod,
      headers: headers,
      body: JSON.stringify(draft),
    });
  };

  restartReview = reviewContent => {
    this.props.dispatch(startReview(null, reviewContent));
  };

  render() {
    let { activeReview, readingList } = this.props;
    return (
      <ReviewWizardContainer
        onPageBack={this.onPageBack}
        restartReview={this.restartReview}
        submitReview={this.submitReview}
        saveDraft={this.saveDraft}
        activeReview={activeReview}
        readingList={readingList}
        submitLoading={this.state.submitLoading}
      />
    );
  }
}

const mapStateToProps = ({ activeReview, readingList, reviews, user }) => {
  return {
    activeReview,
    readingList,
    reviews,
    user,
  };
};

export default connect(
  mapStateToProps,
  null
)(ReviewWizardRedux);

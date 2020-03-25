import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReviewWizardContainer from './ReviewWizard-container';
import {
  startReview,
  endReview,
  updateReadingList,
  updateDrafts,
  updateDraftId,
  updateReviews,
} from '../../actions/index';

class ReviewWizardRedux extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitLoading: false,
    };
  }

  onPageBack = async () => {
    this.props.dispatch(endReview());
  };

  exitReview = () => {
    let { activeReview, activeDraft, drafts, readingList, user } = this.props;

    let headers = {
      'content-type': 'application/json',
      userid: user.userid,
    };

    let { paperId } = activeReview;
    let newReadingList = readingList;

    if (paperId) {
      newReadingList = readingList.filter(currPaper => {
        return currPaper._id !== paperId;
      });
    }

    // update drafts
    let { draftId } = activeDraft;

    if (draftId) {
      let newDrafts = drafts.filter(currDraft => {
        return currDraft._id !== draftId;
      });
      this.props.dispatch(updateDrafts(newDrafts));
      fetch('/api/drafts', {
        method: 'delete',
        headers: headers,
        body: JSON.stringify({ _id: draftId }),
      }).then(response => response.json());
    }

    // update reading list in global state
    this.props.dispatch(updateReadingList(newReadingList));

    // update reading list in DB and re-update global state
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

  saveDraft = async (draft, draftId) => {
    let { user } = this.props;

    let fetchMethod = draftId ? 'put' : 'post';
    let headers = {
      'content-type': 'application/json',
      userid: user.userid,
    };

    if (draftId) {
      headers.id = draftId;
      this.props.dispatch(updateDraftId(draftId));
    }

    const response = await fetch('/api/drafts', {
      method: fetchMethod,
      headers: headers,
      body: JSON.stringify(draft),
    });

    let autosaveStatus = 'saveFailed';
    if (response.status === 200) {
      const returnedDraft = await response.json();
      autosaveStatus = 'saved';
      draftId = returnedDraft._id;
      this.props.dispatch(updateDraftId(draftId));
    }

    return { autosaveStatus, draftId };
  };

  restartReview = reviewContent => {
    this.props.dispatch(startReview(null, null, reviewContent));
  };

  render() {
    let { activeReview, activeDraft, readingList } = this.props;
    return (
      <ReviewWizardContainer
        onPageBack={this.onPageBack}
        restartReview={this.restartReview}
        submitReview={this.submitReview}
        saveDraft={this.saveDraft}
        activeReview={activeReview}
        activeDraft={activeDraft}
        readingList={readingList}
        submitLoading={this.state.submitLoading}
      />
    );
  }
}

const mapStateToProps = ({ activeReview, activeDraft, readingList, reviews, drafts, user }) => {
  return {
    activeReview,
    activeDraft,
    readingList,
    reviews,
    drafts,
    user,
  };
};

export default connect(
  mapStateToProps,
  null
)(ReviewWizardRedux);

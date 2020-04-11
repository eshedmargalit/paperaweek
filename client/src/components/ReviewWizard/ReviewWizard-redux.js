import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import ReviewWizardContainer from './ReviewWizard-container';
import {
  assignReviewPoints,
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

  deleteActiveDraft = async () => {
    let { activeDraft, drafts } = this.props;

    // update drafts
    let { draftId } = activeDraft;

    if (draftId && drafts) {
      let newDrafts = drafts.filter(currDraft => {
        return currDraft._id !== draftId;
      });

      this.props.dispatch(updateDrafts(newDrafts));
      let res = await axios.delete(`api/drafts/${draftId}`);
      this.props.dispatch(updateDrafts(res.data));
    }
  };

  deleteReadingListEntry = async () => {
    let { activeReview, readingList } = this.props;
    let { paperId } = activeReview;
    let newReadingList = readingList;

    if (paperId) {
      newReadingList = readingList.filter(currPaper => {
        return currPaper._id !== paperId;
      });
    }

    // update reading list in global state
    this.props.dispatch(updateReadingList(newReadingList));
    let res = await axios.put('api/readingList', newReadingList);

    // update reading list in DB and re-update global state
    this.props.dispatch(updateReadingList(res.data));
  };

  submitReview = async (reviewObject, reviewId) => {
    const method = reviewId ? 'put' : 'post';
    const url = '/api/papers';

    const data = {
      review: reviewObject,
      id: reviewId,
    };

    this.setState({ submitLoading: true }, async () => {
      let res = await axios({ method, url, data });
      const newReviewList = res.data;
      this.props.dispatch(updateReviews(newReviewList));
      this.deleteActiveDraft();
      if (!reviewId) {
        this.props.dispatch(assignReviewPoints());
      }
      this.deleteReadingListEntry();
      this.props.dispatch(endReview());
    });
  };

  saveDraft = async (draft, draftId) => {
    const method = draftId ? 'put' : 'post';
    const url = '/api/drafts';

    const data = {
      draft: draft,
      id: draftId,
    };

    const res = await axios({ method, url, data });

    let autosaveStatus = 'saveFailed';
    if (res.status === 200) {
      const returnedDraft = res.data;
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

const mapStateToProps = ({ activeReview, activeDraft, readingList, reviews, drafts }) => {
  return {
    activeReview,
    activeDraft,
    readingList,
    reviews,
    drafts,
  };
};

export default connect(
  mapStateToProps,
  null
)(ReviewWizardRedux);

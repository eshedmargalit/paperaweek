import React, { Component } from 'react';
import ReviewWizardView from './ReviewWizard-view';
import ReviewModal from '../ReviewModal/ReviewModal';
import MetadataForm from './MetadataForm';
import ReviewForm from './ReviewForm';
import { blankPaper, blankReview } from './utils.js';

import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

import { Button } from 'antd';
import _ from 'lodash';
import { Redirect } from 'react-router-dom';

class ReviewWizardContainer extends Component {
  constructor(props) {
    super(props);

    let { readingList, activeReview, activeDraft } = this.props;
    let { paperId, reviewContent } = activeReview;
    let { draftId } = activeDraft;

    // always use the paperId if it exists, if not fall back to raw review (without a paper id)
    let paper;
    let review;

    if (paperId) {
      paper = _.find(readingList, { _id: paperId });
    } else if (reviewContent) {
      ({ paper, review } = reviewContent);
    }

    // only autosave at most every 5 seconds
    this.debouncedAutosave = _.debounce(this.autosave, 5 * 1000);
    this.initialPaper = paper || blankPaper;
    this.initialReview = review || blankReview;

    this.state = {
      step: 0,
      showModal: false,
      autosaveStatus: 'unsaved',
      lastSave: null,
      paper: blankPaper,
      review: blankReview,
      draftId: draftId,
      redirectHome: false,
    };
  }

  onModalCancel = () => {
    const reviewContent = {
      paper: this.state.paper,
      review: this.state.review,
    };

    this.setState({ step: 0, showModal: false }, () => {
      this.props.restartReview(reviewContent);
    });
  };

  handleSubmission = () => {
    let { activeReview } = this.props;
    const reviewObject = {
      paper: this.state.paper,
      review: this.state.review,
    };

    // post or put object, refresh papers in Home.js, and exit the form
    let reviewId;
    if (activeReview.reviewContent) {
      reviewId = activeReview.reviewContent._id;
    }

    this.props.submitReview(reviewObject, reviewId);
  };

  getMetadata = paper => {
    this.setState({ paper: paper, step: 1 });
  };

  getReview = review => {
    this.setState({ review: review, step: 2 }, () => {
      this.setState({ showModal: true });
    });
  };

  autosave = () => {
    const reviewFromState = {
      paper: this.state.paper,
      review: this.state.review,
    };

    this.setState({ autosaveStatus: 'saving' }, async () => {
      const response = await this.props.saveDraft(reviewFromState, this.state.draftId);
      this.setState(response);
    });
  };

  updatePaper = paper => {
    this.setState({ paper }, () => {
      this.debouncedAutosave();
    });
  };

  updateReview = review => {
    this.setState({ review }, () => {
      this.debouncedAutosave();
    });
  };

  render() {
    const step0 = <MetadataForm paper={this.initialPaper} onSubmit={this.getMetadata} onChange={this.updatePaper} />;
    const step1 = <ReviewForm review={this.initialReview} onSubmit={this.getReview} onChange={this.updateReview} />;
    const modalFooter = [
      <Button
        key="submit"
        type="primary"
        icon={<CheckOutlined />}
        onClick={this.handleSubmission}
        loading={this.props.submitLoading}
      >
        Looks good, submit!
      </Button>,
      <Button key="cancel" icon={<CloseOutlined />} onClick={this.onModalCancel} style={{ borderColor: 'red' }}>
        Cancel
      </Button>,
    ];

    const reviewFromState = {
      paper: this.state.paper,
      review: this.state.review,
    };

    const modal = (
      <div>
        <ReviewModal
          review={reviewFromState}
          visible={this.state.showModal}
          onClose={this.onModalCancel}
          footer={modalFooter}
        />
      </div>
    );
    const stepContent = [step0, step1, modal];

    return this.state.redirectHome ? (
      <Redirect to="/dashboard" push />
    ) : (
      <ReviewWizardView
        autosaveStatus={this.state.autosaveStatus}
        lastSave={this.state.lastSave}
        onPageBack={() => this.setState({ redirectHome: true })}
        currentStep={this.state.step}
        stepContent={stepContent[this.state.step]}
      />
    );
  }
}

export default ReviewWizardContainer;

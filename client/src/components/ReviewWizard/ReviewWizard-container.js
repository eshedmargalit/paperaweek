import React, { Component } from 'react';
import ReviewWizardView from './ReviewWizard-view';
import ReviewModal from '../ReviewModal/ReviewModal';
import MetadataForm from './MetadataForm';
import ReviewForm from './ReviewForm';
import { blankPaper, blankReview } from './utils.js';

import { Button } from 'antd';
import _ from 'lodash';

class ReviewWizardContainer extends Component {
  constructor(props) {
    super(props);

    let { readingList, activeReview } = this.props;
    let { paperId, reviewContent } = activeReview;

    // always use the paperId if it exists, if not fall back to raw review (without a paper id)
    let paper;
    let review;

    if (paperId) {
      paper = _.find(readingList, { _id: paperId });
    } else if (reviewContent) {
      ({ paper, review } = reviewContent);
    }

    this.state = {
      step: 0,
      showModal: false,
      paper: paper || blankPaper,
      review: review || blankReview,
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

  render() {
    const step0 = <MetadataForm paper={this.state.paper} onSubmit={this.getMetadata} />;
    const step1 = <ReviewForm review={this.state.review} onSubmit={this.getReview} />;
    const modalFooter = [
      <Button
        key="submit"
        type="primary"
        icon="check"
        onClick={this.handleSubmission}
        loading={this.props.submitLoading}
      >
        Looks good, submit!
      </Button>,
      <Button key="cancel" icon="close" onClick={this.onModalCancel} style={{ borderColor: 'red' }}>
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

    return (
      <ReviewWizardView
        showWizard={this.props.activeReview.showForm}
        onPageBack={this.props.onPageBack}
        currentStep={this.state.step}
        stepContent={stepContent[this.state.step]}
      />
    );
  }
}

export default ReviewWizardContainer;

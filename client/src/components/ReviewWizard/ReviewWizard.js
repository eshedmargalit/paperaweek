import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Icon, PageHeader, Steps } from 'antd';
import MetadataForm from './MetadataForm';
import ReviewForm from './ReviewForm';
import ReviewModal from '../ReviewModal/ReviewModal';

import { connect } from 'react-redux';
import _ from 'lodash';
import { startReview, endReview, updateReadingList, updateReviews } from '../../actions/index';
import './ReviewWizard.scss';
import { blankPaper, blankReview } from './utils.js';

const { Step } = Steps;

class ReviewWizard extends Component {
  constructor(props) {
    super(props);

    let { activeReview, readingList } = this.props;
    let { paperId, reviewContent } = activeReview;

    let paper;
    let review;

    // NB: always use the paperId if it exists, if not fall back on provided content
    if (paperId) {
      paper = _.find(readingList, { _id: paperId });
    } else if (reviewContent) {
      ({ paper, review } = reviewContent);
    }

    this.state = {
      showModal: false,
      submitLoading: false,
      step: 0,
      paper: paper || blankPaper,
      review: review || blankReview,
    };
  }

  removeFromReadingList = () => {
    let { activeReview } = this.props;
    let { paperId } = activeReview;
    if (!paperId) {
      return;
    }

    let newReadingList = this.props.readingList.filter(currPaper => {
      return currPaper._id !== paperId;
    });

    this.props.dispatch(updateReadingList(newReadingList));

    let headers = {
      'content-type': 'application/json',
      userid: this.props.user.userid,
    };

    fetch('/api/readingList', {
      method: 'put',
      headers: headers,
      body: JSON.stringify(newReadingList),
    })
      .then(response => response.json())
      .then(data => {
        this.props.dispatch(updateReadingList(data));
      });
  };

  confirmSuccess = () => {
    this.setState({ submitLoading: false }, () => {
      this.removeFromReadingList();
      this.props.dispatch(endReview());
    });
  };

  handleCancel = () => {
    const reviewContent = {
      paper: this.state.paper,
      review: this.state.review,
    };

    this.setState({ step: 0, showModal: false }, () => {
      this.props.dispatch(startReview(null, reviewContent));
    });
  };

  handleSubmission = () => {
    let { user, activeReview } = this.props;
    const reviewObject = {
      paper: this.state.paper,
      review: this.state.review,
    };

    // post or put object, refresh papers in Home.js, and exit the form
    let review_id;
    if (activeReview.reviewContent) {
      review_id = activeReview.reviewContent._id;
    }
    let fetch_method = 'post';
    let headers = {
      'content-type': 'application/json',
      userid: user.userid,
    };
    if (review_id) {
      fetch_method = 'put';
      headers = {
        'content-type': 'application/json',
        id: review_id,
        userid: user.userid,
      };
    }

    this.setState({ submitLoading: true }, () => {
      fetch('/api/papers', {
        method: fetch_method,
        headers: headers,
        body: JSON.stringify(reviewObject),
      })
        .then(response => response.json())
        .then(newReviewList => {
          this.props.dispatch(updateReviews(newReviewList));
          this.confirmSuccess();
        });
    });
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
    let { activeReview } = this.props;
    const step0 = <MetadataForm paper={this.state.paper} onSubmit={this.getMetadata} />;
    const step1 = <ReviewForm review={this.state.review} onSubmit={this.getReview} />;

    const modalFooter = [
      <Button key="submit" type="primary" icon="check" onClick={this.handleSubmission}>
        Looks good, submit!
      </Button>,
      <Button key="cancel" icon="close" onClick={this.handleCancel} style={{ borderColor: 'red' }}>
        Cancel
      </Button>,
    ];

    const reviewFromState = {
      paper: this.state.paper,
      review: this.state.review,
    };

    const step2 = (
      <div>
        <ReviewModal
          review={reviewFromState}
          visible={this.state.showModal}
          onClose={this.handleCancel}
          footer={modalFooter}
        />
        <Button type="primary" onClick={this.handleSubmission} loading={this.state.submitLoading}>
          Looks good! Submit
        </Button>{' '}
        <Button type="danger" onClick={this.handleCancel}>
          Cancel <Icon type="close-circle" />
        </Button>
      </div>
    );
    const step_content = [step0, step1, step2];

    let homeRedirect = <Redirect to="/dashboard" push />;
    let wizardRender = (
      <div className="width80">
        <div>
          <PageHeader
            title="Write a Review"
            subTitle="Search online for papers"
            onBack={() => {
              this.props.dispatch(endReview());
            }}
          />
          <Steps current={this.state.step}>
            <Step title="Enter Paper Metadata" />
            <Step title="Write Review" />
            <Step title="Preview and Submit" subTitle="🎉" />
          </Steps>
        </div>
        <br />
        <div>{step_content[this.state.step]}</div>
      </div>
    );
    return <div>{activeReview.showForm ? wizardRender : homeRedirect}</div>;
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
)(ReviewWizard);

import React, { Component } from "react";
import { Modal, PageHeader, Steps } from "antd";
import MetadataForm from "./MetadataForm";
import ReviewForm from "./ReviewForm";

import { connect } from "react-redux";
import { exit_form } from "../../actions/index";
import "./ReviewWizard.css";

const { Step } = Steps;

class ReviewWizard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0
    };
    this.reviewFromStore = this.props.data.review_data.review_object;
  }

  openSuccessModelAndExit = () => {
    let secondsToGo = 3;
    const modal = Modal.success({
      title: "Success! Review Submitted",
      content: `Taking you back home in ${secondsToGo}s.`
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: `Taking you back home in ${secondsToGo}s.`
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
      this.props.dispatch(exit_form());
    }, secondsToGo * 1000);
  };

  confirmSuccess = () => {
    this.setState({ submitting: false }, () => {
      this.props.refreshPapers();
      this.openSuccessModelAndExit();
    });
  };

  handleSubmission() {
    const reviewObject = {
      metadata: this.state.metadata,
      review: this.state.review
    };

    // post or put object, refresh papers in Home.js, and exit the form
    let review_id = this.reviewFromStore._id;
    let fetch_method = "post";
    let headers = { "content-type": "application/json" };
    if (review_id) {
      fetch_method = "put";
      headers = { "content-type": "application/json", id: review_id };
    }
    fetch("/api/papers", {
      method: fetch_method,
      headers: headers,
      body: JSON.stringify(reviewObject)
    })
      .then(response => response.json())
      .then(data => {
        console.log(JSON.stringify(data));
        this.confirmSuccess();
      });
  }

  getMetadata = metadata => {
    this.setState({ metadata: metadata, step: 1 });
  };

  getReview = review => {
    this.setState({ review: review }, this.handleSubmission);
  };

  render() {
    const step0 = <MetadataForm onSubmit={this.getMetadata} />;
    const step1 = <ReviewForm onSubmit={this.getReview} />;
    const step2 = <div>Woah</div>;
    const step_content = [step0, step1, step2];
    return (
      <div>
        <div>
          <PageHeader
            title="Write a Review"
            subTitle="Search online for papers"
            onBack={() => {
              this.props.dispatch(exit_form());
            }}
          />
          <Steps current={this.state.step}>
            <Step title="Enter Paper Metadata" />
            <Step title="Write Review" />
            <Step title="Submit" subTitle="🎉" />
          </Steps>
        </div>
        <br />
        <div>{step_content[this.state.step]}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state
  };
};

export default connect(
  mapStateToProps,
  null
)(ReviewWizard);

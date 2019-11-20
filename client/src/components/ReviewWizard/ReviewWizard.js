import React, { Component } from "react";
import { Button, Icon, PageHeader, Steps } from "antd";
import MetadataForm from "./MetadataForm";
import ReviewForm from "./ReviewForm";
import ReviewModal from "../ReviewModal/ReviewModal";

import { connect } from "react-redux";
import { start_review, exit_form } from "../../actions/index";
import "./ReviewWizard.css";

const { Step } = Steps;

const blankReview = {
  metadata: {
    title: "",
    author_names: [""],
    institution_names: [""],
    date: new Date(),
    doi: "",
    journal: "",
    url: ""
  },
  review: {
    summary_points: [""],
    background_points: [""],
    approach_points: [""],
    results_points: [""],
    conclusions_points: [""],
    other_points: [""]
  }
};

class ReviewWizard extends Component {
  constructor(props) {
    super(props);

    this.reviewFromStore =
      this.props.data.review_data.review_object || blankReview;

    this.state = {
      showModal: false,
      submitLoading: false,
      step: 0,
      metadata: this.reviewFromStore.metadata,
      review: this.reviewFromStore.review
    };
  }

  confirmSuccess = () => {
    this.setState({ submitLoading: false }, () => {
      this.props.refreshPapers();
      this.props.dispatch(exit_form());
    });
  };

  handleCancel = () => {
    const reviewObject = {
      metadata: this.state.metadata,
      review: this.state.review
    };

    this.setState({ step: 0, showModal: false }, () => {
      this.props.dispatch(start_review(reviewObject));
    });
  };

  handleSubmission = () => {
    const reviewObject = {
      paper: this.state.metadata,
      review: this.state.review
    };

    // post or put object, refresh papers in Home.js, and exit the form
    let review_id = this.reviewFromStore._id;
    let fetch_method = "post";
    let headers = {
      "content-type": "application/json",
      userid: this.props.userid
    };
    if (review_id) {
      fetch_method = "put";
      headers = {
        "content-type": "application/json",
        id: review_id,
        userid: this.props.userid
      };
    }

    this.setState({ submitLoading: true }, () => {
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
    });
  };

  getMetadata = metadata => {
    this.setState({ metadata: metadata, step: 1 });
  };

  // TODO: state not being stashed properly at each step?
  getReview = review => {
    this.setState({ review: review, step: 2 }, () => {
      this.setState({ showModal: true });
    });
  };

  render() {
    const step0 = (
      <MetadataForm
        metadata={this.state.metadata}
        onSubmit={this.getMetadata}
      />
    );
    const step1 = (
      <ReviewForm review={this.state.review} onSubmit={this.getReview} />
    );

    const modalFooter = [
      <Button
        key="submit"
        type="primary"
        icon="check"
        onClick={this.handleSubmission}
      >
        Looks good, submit!
      </Button>,
      <Button
        key="cancel"
        icon="close"
        onClick={this.handleCancel}
        style={{ borderColor: "red" }}
      >
        Cancel
      </Button>
    ];

    const reviewFromState = {
      metadata: this.state.metadata,
      review: this.state.review
    };

    const step2 = (
      <div>
        <ReviewModal
          review={reviewFromState}
          visible={this.state.showModal}
          onClose={this.handleCancel}
          footer={modalFooter}
        />
        <Button
          type="primary"
          onClick={this.handleSubmission}
          loading={this.state.submitLoading}
        >
          Looks good! Submit
        </Button>{" "}
        <Button type="danger" onClick={this.handleCancel}>
          Cancel <Icon type="close-circle" />
        </Button>
      </div>
    );
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
            <Step title="Preview and Submit" subTitle="🎉" />
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

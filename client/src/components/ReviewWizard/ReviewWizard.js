import React, { Component } from "react";
import { Button, Icon, PageHeader, Tag, Steps } from "antd";
import moment from "moment";
import MetadataForm from "./MetadataForm";
import ReviewForm from "./ReviewForm";

import { connect } from "react-redux";
import { start_review, exit_form } from "../../actions/index";
import { render_comma_sep_list } from "../utils.js";
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

    this.state = {
      submit_loading: false,
      step: 0
    };

    this.reviewFromStore =
      this.props.data.review_data.review_object || blankReview;
  }

  confirmSuccess = () => {
    this.setState({ submit_loading: false }, () => {
      this.props.refreshPapers();
      this.props.dispatch(exit_form());
    });
  };

  handleCancel = () => {
    const reviewObject = {
      metadata: this.state.metadata,
      review: this.state.review
    };

    this.setState({ step: 0 }, () => {
      this.props.dispatch(start_review(reviewObject));
    });
  };

  handleSubmission = () => {
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

    this.setState({ submit_loading: true }, () => {
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

  getReview = review => {
    this.setState({ review: review, step: 2 });
  };

  getTagColor = tag => {
    var hash = 0;
    for (var i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }

    var shortened = hash % 360;
    const saturation = "80%";
    const lightness = "30%";
    return "hsl(" + shortened + "," + saturation + "," + lightness + ")";
  };

  renderTags = tags => {
    let tagRender = null;

    if (tags && tags.length > 0) {
      tagRender = tags.map(tag => {
        if (tag === "") {
          return null;
        }
        return (
          <Tag color={this.getTagColor(tag)} key={tag}>
            {tag}
          </Tag>
        );
      });
    }
    return tagRender;
  };

  renderReview = (metadata, review) => {
    if (!review || !metadata) {
      return null;
    }
    const date_str = moment(metadata.date, "YYYY-MM").format("MMMM YYYY");
    let doi_tag = null;
    if (metadata.doi) {
      doi_tag = (
        <a
          href={"http://dx.doi.org/" + metadata.doi}
          target="_blank"
          rel="noopener noreferrer"
        >
          ({metadata.doi})
        </a>
      );
    }

    const fields = [
      {
        heading: "General Summary",
        review_key: "summary_points"
      },
      {
        heading: "Background",
        review_key: "background_points"
      },
      {
        heading: "Approach",
        review_key: "approach_points"
      },
      {
        heading: "Results",
        review_key: "results_points"
      },
      {
        heading: "Conclusions",
        review_key: "conclusions_points"
      },
      {
        heading: "Other Information",
        review_key: "other_points"
      }
    ];

    const reviewBody = fields.map(field => {
      let empty = true;
      let to_render = (
        <div key={field.heading}>
          <strong>{field.heading}</strong>
          <ul>
            {review[field.review_key].map(point => {
              if (point !== "") {
                empty = false;
              }
              return <li key={point}>{point}</li>;
            })}
          </ul>
        </div>
      );

      return empty ? null : to_render;
    });

    return (
      <div>
        <PageHeader
          tags={this.renderTags(metadata.keywords)}
          title={metadata.title}
        />
        <div>
          {render_comma_sep_list(metadata.authors)}
          {render_comma_sep_list(metadata.institutions)}
          Published in {metadata.journal} in {date_str}
          {` `}
          {doi_tag}
        </div>
        <hr />
        {reviewBody}
      </div>
    );
  };

  render() {
    const step0 = (
      <MetadataForm
        metadata={this.reviewFromStore.metadata}
        onSubmit={this.getMetadata}
      />
    );
    const step1 = (
      <ReviewForm
        review={this.reviewFromStore.review}
        onSubmit={this.getReview}
      />
    );
    const step2 = (
      <div>
        {this.renderReview(this.state.metadata, this.state.review)}
        <Button
          type="primary"
          onClick={this.handleSubmission}
          loading={this.state.submit_loading}
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

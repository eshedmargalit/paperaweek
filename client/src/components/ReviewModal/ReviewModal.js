import React, { Component } from "react";
import { Modal, Tag } from "antd";
import moment from "moment";
import { render_comma_sep_list } from "../utils.js";

class ReviewModal extends Component {
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
    let tag_render = null;

    if (tags && tags.length > 0) {
      tag_render = tags.map(tag => {
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
    return tag_render;
  };
  render() {
    if (!this.props.review) return null;
    let { metadata, review } = this.props.review;
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

    const titleDiv = (
      <div>
        <div>{metadata.title}</div>
        <div>{this.renderTags(metadata.keywords)}</div>
      </div>
    );

    return (
      <div>
        <Modal
          title={titleDiv}
          visible={this.props.visible}
          onCancel={this.props.onClose}
          footer={this.props.footer}
          width="80%"
        >
          <div>
            {render_comma_sep_list(metadata.authors)}
            {render_comma_sep_list(metadata.institutions)}
            Published in {metadata.journal} in {date_str}
            {` `}
            {doi_tag}
          </div>
          <hr />
          {reviewBody}
        </Modal>
      </div>
    );
  }
}
export default ReviewModal;

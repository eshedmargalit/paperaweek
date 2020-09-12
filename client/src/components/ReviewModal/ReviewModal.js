import React, { Component } from 'react';
import { Modal, Tag } from 'antd';
import moment from 'moment';
import { renderCommaSepList, wrapMath } from '../utils.js';

class ReviewModal extends Component {
  getTagColor = tag => {
    var hash = 0;
    for (var i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }

    var shortened = hash % 360;
    const saturation = '80%';
    const lightness = '30%';
    return 'hsl(' + shortened + ',' + saturation + ',' + lightness + ')';
  };

  renderTags = tags => {
    let tag_render = null;

    if (tags && tags.length > 0) {
      tag_render = tags.map(tag => {
        if (tag === '') {
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
    let { paper, review } = this.props.review;
    const date_str = moment(paper.date, 'YYYY-MM').format('MMMM YYYY');

    let doi_tag = null;
    if (paper.doi) {
      doi_tag = (
        <a href={'http://dx.doi.org/' + paper.doi} target="_blank" rel="noopener noreferrer">
          ({paper.doi})
        </a>
      );
    }

    const fields = [
      {
        heading: 'General Summary',
        review_key: 'summary_points',
      },
      {
        heading: 'Background',
        review_key: 'background_points',
      },
      {
        heading: 'Approach',
        review_key: 'approach_points',
      },
      {
        heading: 'Results',
        review_key: 'results_points',
      },
      {
        heading: 'Conclusions',
        review_key: 'conclusions_points',
      },
      {
        heading: 'Other Information',
        review_key: 'other_points',
      },
    ];

    const reviewBody = fields.map(field => {
      let empty = true;
      let to_render = (
        <div key={field.heading}>
          <strong>{field.heading}</strong>
          <ul>
            {review[field.review_key].map(point => {
              if (point !== '') {
                empty = false;
              }
              const wrappedPoint = wrapMath(point);
              console.log(wrappedPoint);
              return <li key={point}>{wrapMath(point)}</li>;
            })}
          </ul>
        </div>
      );

      return empty ? null : to_render;
    });

    const titleDiv = (
      <div>
        <div>{paper.title}</div>
        <div>{this.renderTags(paper.keywords)}</div>
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
            {renderCommaSepList(paper.authors)}
            {renderCommaSepList(paper.institutions)}
            Published in {paper.journal} in {date_str}
            {` `}
            {doi_tag}
          </div>
          <br />
          <strong>TLDR</strong>
          <br />
          {paper.one_sentence}
          <hr />
          {reviewBody}
        </Modal>
      </div>
    );
  }
}
export default ReviewModal;

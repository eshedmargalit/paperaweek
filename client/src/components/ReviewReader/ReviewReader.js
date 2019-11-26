import React, { Component } from 'react';
import { Button, Row, Col, Modal, Table, Input, PageHeader, Tag } from 'antd';
import { start_review } from '../../actions/index';
import { connect } from 'react-redux';
import moment from 'moment';
import Fuse from 'fuse.js';
import { shortenAuthors, shortenString } from '../utils.js';
import ReviewModal from '../ReviewModal/ReviewModal';
import './ReviewReader.css';

const { confirm } = Modal;

const displaySettings = {
  titleStringLengthLimit: 150,
  journalStringLengthLimit: 30,
};

class ReviewReader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      selectedReview: null,
      showModal: false,
    };
  }

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

  handleSearch = query => {
    this.setState({ query });
  };

  reviewClicked = review => {
    this.setState({
      selectedReview: review,
      showModal: true,
    });
  };

  handleModalClose = () => {
    this.setState({
      selectedReview: null,
      showModal: false,
    });
  };

  handleModalEdit = () => {
    this.props.dispatch(start_review(this.state.selectedReview));
  };

  handleModalDelete = () => {
    confirm({
      title: 'Are you sure delete this review?',
      content: "Once it's gone, it's gone forever!",
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        fetch('/api/papers', {
          method: 'delete',
          headers: {
            'content-type': 'application/json',
            userid: this.props.userid,
          },
          body: JSON.stringify(this.state.selectedReview),
        })
          .then(response => response.json())
          .then(() => {
            this.props.refreshPapers();
            this.handleModalClose();
          });
      },
      onCancel() {},
    });
  };

  renderTags = tags => {
    let tag_render = null;

    if (tags && tags.length > 0) {
      tag_render = tags.map(tag => {
        if (tag === '') {
          return null;
        }
        return (
          <Tag
            color={this.getTagColor(tag)}
            onClick={e => {
              e.stopPropagation();
              this.handleSearch(`${e.target.innerHTML}`);
            }}
            style={{ marginBottom: '8px' }}
            key={tag}
          >
            {tag}
          </Tag>
        );
      });
    }
    return tag_render;
  };

  fuzzyFilterReviews = reviews => {
    if (this.state.query === '') {
      return reviews;
    }
    var options = {
      shouldSort: false,
      threshold: 0.2,
      location: 0,
      distance: 5000,
      maxPatternLength: 32,
      minMatchCharLength: 4,
      keys: ['paper.title', 'paper.authors', 'paper.keywords', 'paper.date'],
    };

    var fuse = new Fuse(reviews, options);
    const results = fuse.search(this.state.query);
    return results;
  };

  editReview = review => {
    this.props.dispatch(start_review(review));
  };

  renderReviews = reviews => {
    const columns = [
      {
        title: 'Title',
        dataIndex: 'paper.title',
        render: title => <span>{shortenString(title, displaySettings.titleStringLengthLimit)}</span>,
      },
      {
        title: 'Authors',
        dataIndex: 'paper.authors',
        render: authorList => <span>{shortenAuthors(authorList)}</span>,
      },
      {
        title: 'Year Published',
        dataIndex: 'paper.date',
        render: date => <span>{moment(date, 'YYYY-MM').format('YYYY')}</span>,
        sorter: (a, b) => {
          return moment(a.paper.date).diff(moment(b.paper.date));
        },
      },
      {
        title: 'Journal',
        dataIndex: 'paper.journal',
        render: journal => <span>{shortenString(journal, displaySettings.journalStringLengthLimit)}</span>,
      },
      {
        title: 'Review Date',
        dataIndex: 'createdAt',
        render: date => <span>{moment(date).format('MMMM Do, YYYY')}</span>,
        sorter: (a, b) => {
          return moment(a.createdAt).diff(moment(b.createdAt));
        },
        defaultSortOrder: 'descend',
      },
      {
        title: 'Keywords',
        dataIndex: 'paper.keywords',
        render: keywords => this.renderTags(keywords),
      },
    ];

    return (
      <Table
        onRow={(review, reviewIndex) => {
          return {
            onClick: () => {
              this.reviewClicked(review);
            },
          };
        }}
        rowKey={review => review._id}
        columns={columns}
        dataSource={reviews}
        page_size={10}
        pagination={reviews.length > 10}
      />
    );
  };

  render() {
    const modalFooter = [
      <Button key="edit" type="dashed" icon="edit" onClick={this.handleModalEdit}>
        Edit this Review
      </Button>,
      <Button key="delete" type="dashed" icon="delete" onClick={this.handleModalDelete}>
        Delete this Review
      </Button>,
    ];
    return (
      <>
        <Row className="review-reader">
          <Col lg={8} sm={24}>
            <PageHeader title="Read Your Reviews" avatar={{ icon: 'read' }} />
          </Col>
          <Col lg={16} sm={24}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ width: '100%' }}>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      padding: '24px',
                      width: '100%',
                    }}
                  >
                    <Input
                      type="text"
                      onChange={e => this.handleSearch(`${e.target.value}`)}
                      placeholder="Filter by title, author, or journal"
                      value={this.state.query}
                      allowClear
                    />
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <div>
          <div>{this.renderReviews(this.fuzzyFilterReviews(this.props.reviews))}</div>
        </div>
        <ReviewModal
          review={this.state.selectedReview}
          visible={this.state.showModal}
          onClose={this.handleModalClose}
          footer={modalFooter}
        />
      </>
    );
  }
}

export default connect()(ReviewReader);

import React, { Component } from "react";
import { Button, Row, Col, Modal, Table, Input, PageHeader, Tag } from "antd";
import { start_review } from "../../actions/index";
import { connect } from "react-redux";
import moment from "moment";
import Fuse from "fuse.js";
import { shortenAuthors, shortenString } from "../utils.js";
import ReviewModal from "../ReviewModal/ReviewModal";
import "./ReviewReader.css";

const { confirm } = Modal;

const displaySettings = {
  titleStringLengthLimit: 200,
  journalStringLengthLimit: 30
};

class ReviewReader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      selectedReview: null,
      showModal: false
    };
  }

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

  handleSearch = query => {
    this.setState({ query });
  };

  reviewClicked = review => {
    this.setState({
      selectedReview: review,
      showModal: true
    });
  };

  handleModalClose = () => {
    this.setState({
      selectedReview: null,
      showModal: false
    });
  };

  handleModalEdit = () => {
    this.props.dispatch(start_review(this.state.selectedReview));
  };

  handleModalDelete = () => {
    confirm({
      title: "Are you sure delete this review?",
      content: "Once it's gone, it's gone forever!",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        fetch("/api/papers", {
          method: "delete",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(this.state.selectedReview)
        })
          .then(response => response.json())
          .then(() => {
            this.props.refreshPapers();
            this.handleModalClose();
          });
      },
      onCancel() {}
    });
  };

  renderTags = tags => {
    let tag_render = null;

    if (tags && tags.length > 0) {
      tag_render = tags.map(tag => {
        if (tag === "") {
          return null;
        }
        return (
          <Tag
            color={this.getTagColor(tag)}
            onClick={e => {
              e.stopPropagation();
              this.handleSearch(`${e.target.innerHTML}`);
            }}
            style={{ marginBottom: "8px" }}
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
    if (this.state.query === "") {
      return reviews;
    }
    var options = {
      shouldSort: false,
      threshold: 0.2,
      location: 0,
      distance: 5000,
      maxPatternLength: 32,
      minMatchCharLength: 4,
      keys: [
        "metadata.title",
        "metadata.authors",
        "metadata.keywords",
        "metadata.date"
      ]
    };

    var fuse = new Fuse(reviews, options);
    const results = fuse.search(this.state.query);
    return results;
  };

  editReview = review => {
    this.props.dispatch(start_review(review));
  };

  renderReviews = papers => {
    const columns = [
      {
        title: "Title",
        dataIndex: "metadata.title",
        render: title => (
          <span>
            {shortenString(title, displaySettings.titleStringLengthLimit)}
          </span>
        )
      },
      {
        title: "Authors",
        dataIndex: "metadata.authors",
        render: authorList => <span>{shortenAuthors(authorList)}</span>
      },
      {
        title: "Year Published",
        dataIndex: "metadata.date",
        render: date => <span>{moment(date, "YYYY-MM").format("YYYY")}</span>,
        sorter: (a, b) => {
          return moment(a.metadata.date).diff(moment(b.metadata.date));
        }
      },
      {
        title: "Journal",
        dataIndex: "metadata.journal",
        render: journal => (
          <span>
            {shortenString(journal, displaySettings.journalStringLengthLimit)}
          </span>
        )
      },
      {
        title: "Review Date",
        dataIndex: "createdAt",
        render: date => <span>{moment(date).format("MMMM Do, YYYY")}</span>,
        sorter: (a, b) => {
          return moment(a.createdAt).diff(moment(b.createdAt));
        },
        defaultSortOrder: "descend"
      },
      {
        title: "Keywords",
        dataIndex: "metadata.keywords",
        render: keywords => this.renderTags(keywords)
      }
    ];

    return (
      <Table
        onRow={(review, reviewIndex) => {
          return {
            onClick: () => {
              this.reviewClicked(review);
            }
          };
        }}
        rowKey={review => review._id}
        columns={columns}
        dataSource={papers}
        page_size={10}
        pagination={papers.length > 10}
      />
    );
  };

  render() {
    const modalFooter = [
      <Button
        key="edit"
        type="dashed"
        icon="edit"
        onClick={this.handleModalEdit}
      >
        Edit this Review
      </Button>,
      <Button
        key="delete"
        type="dashed"
        icon="delete"
        onClick={this.handleModalDelete}
      >
        Delete this Review
      </Button>
    ];
    return (
      <>
        <Row>
          <Col lg={6} sm={24}>
            <PageHeader title="Read Your Reviews" avatar={{ icon: "read" }} />
          </Col>
          <Col lg={18} sm={24}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                padding: "24px"
              }}
            >
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between"
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      marginRight: "100px",
                      marginBottom: "20px"
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
          <div>
            {this.renderReviews(this.fuzzyFilterReviews(this.props.papers))}
          </div>
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

import React from 'react';
import { Button, Col, Input, Modal, PageHeader, Row, Table, Tag } from 'antd';
import moment from 'moment';
import { shortenAuthors, shortenString, getTagColor } from '../utils.js';
import ReviewModal from '../ReviewModal/ReviewModal';
import './ReviewReader.scss';

const { confirm } = Modal;

const handleModalDelete = onOkHandler => {
  confirm({
    title: 'Are you sure delete this review?',
    content: "Once it's gone, it's gone forever!",
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk: onOkHandler,
    onCancel() {},
  });
};

const renderReviews = (reviews, handleSearch, reviewClicked) => {
  const displaySettings = {
    titleStringLengthLimit: 150,
    journalStringLengthLimit: 30,
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'paper.title',
      render: title => <span>{shortenString(title, displaySettings.titleStringLengthLimit)}</span>,
    },
    {
      title: 'One Sentence',
      dataIndex: 'paper.one_sentence',
      render: one_sentence => <span>{one_sentence}</span>,
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
      render: keywords => renderTags(keywords, handleSearch),
    },
  ];

  return (
    <Table
      onRow={(review, reviewIndex) => {
        return {
          onClick: () => {
            reviewClicked(review);
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

const renderTags = (tags, handleSearch) => {
  let tag_render = null;

  if (tags && tags.length > 0) {
    tag_render = tags.map(tag => {
      if (tag === '') {
        return null;
      }
      return (
        <Tag
          color={getTagColor(tag)}
          onClick={e => {
            e.stopPropagation();
            handleSearch(`${e.target.innerHTML}`);
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

function ReviewReaderView({ handleSearch, reviewClicked, query, reviews, modalProps }) {
  let { deleteConfirmHandler, handleModalEdit, handleModalClose, showModal, modalReview } = modalProps;

  const searchRow = (
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
                  onChange={e => handleSearch(`${e.target.value}`)}
                  placeholder="Filter by title, author, or journal"
                  value={query}
                  allowClear
                />
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );

  const modalFooter = [
    <Button key="edit" type="dashed" icon="edit" onClick={handleModalEdit}>
      Edit this Review
    </Button>,
    <Button key="delete" type="dashed" icon="delete" onClick={() => handleModalDelete(deleteConfirmHandler)}>
      Delete this Review
    </Button>,
  ];

  const reviewModal = (
    <ReviewModal review={modalReview} visible={showModal} onClose={handleModalClose} footer={modalFooter} />
  );

  const reviewsTable = renderReviews(reviews, handleSearch, reviewClicked);

  return (
    <>
      {searchRow}
      {reviewsTable}
      {reviewModal}
    </>
  );
}

export default ReviewReaderView;

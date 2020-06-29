import React from 'react';
import { DeleteOutlined, EditOutlined, ReadOutlined } from '@ant-design/icons';
import { Button, Col, Input, Modal, PageHeader, Row, Table, Tag } from 'antd';
import moment from 'moment';
import { shortenAuthors, shortenString, getTagColor } from '../utils.js';
import ReviewModal from '../ReviewModal/ReviewModal';
import './SearchableReviewDisplay.scss';

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
      dataIndex: ['paper', 'title'],
      render: title => <span>{shortenString(title, displaySettings.titleStringLengthLimit)}</span>,
    },
    {
      title: 'One Sentence',
      dataIndex: ['paper', 'one_sentence'],
      render: one_sentence => <span>{one_sentence}</span>,
    },
    {
      title: 'Authors',
      dataIndex: ['paper', 'authors'],
      render: authorList => <span>{shortenAuthors(authorList)}</span>,
    },
    {
      title: 'Year Published',
      dataIndex: ['paper', 'date'],
      render: date => <span>{moment(date, 'YYYY-MM').format('YYYY')}</span>,
      sorter: (a, b) => {
        return moment(a.paper.date).diff(moment(b.paper.date));
      },
    },
    {
      title: 'Journal',
      dataIndex: ['paper', 'journal'],
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
      dataIndex: ['paper', 'keywords'],
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

function SearchableReviewDisplayView({
  handleSearch,
  reviewClicked,
  query,
  reviews,
  modalProps,
  hideFooter,
  pageHeaderProps,
}) {
  const {
    deleteConfirmHandler,
    handleModalEdit,
    handleModalCopy,
    handleModalClose,
    showModal,
    modalReview,
  } = modalProps;

  const { pageHeaderTitle, onPageBack } = pageHeaderProps;

  let pageHeader;
  if (onPageBack) {
    pageHeader = <PageHeader title={pageHeaderTitle} onBack={onPageBack} />;
  } else {
    pageHeader = <PageHeader title={pageHeaderTitle} avatar={{ icon: <ReadOutlined /> }} />;
  }

  const searchRow = (
    <Row className="review-reader">
      <Col lg={8} sm={24}>
        {pageHeader}
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

  let reviewModal = null;
  let itemName = modalProps.itemName || 'Review';
  const copyButton = (
    <Button key="copy" type="dashed" icon={<EditOutlined />} onClick={handleModalCopy}>
      Copy Link to this {itemName}
    </Button>
  );
  let modalFooter = [
    <Button key="edit" type="dashed" icon={<EditOutlined />} onClick={handleModalEdit}>
      Edit this {itemName}
    </Button>,
    <Button
      key="delete"
      type="dashed"
      icon={<DeleteOutlined />}
      onClick={() => handleModalDelete(deleteConfirmHandler)}
    >
      Delete this {itemName}
    </Button>,
  ];

  if (itemName === 'Review') {
    modalFooter.splice(0, 0, copyButton);
  }

  const footer = hideFooter ? null : modalFooter;
  reviewModal = <ReviewModal review={modalReview} visible={showModal} onClose={handleModalClose} footer={footer} />;

  const reviewsTable = renderReviews(reviews, handleSearch, reviewClicked);

  return (
    <>
      {searchRow}
      {reviewsTable}
      {reviewModal}
    </>
  );
}

export default SearchableReviewDisplayView;

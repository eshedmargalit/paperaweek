import React from 'react';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, ReadOutlined } from '@ant-design/icons';
import { Button, Col, Input, Modal, PageHeader, Row, Table, Tag } from 'antd';
import moment from 'moment';
import { ColumnsType } from 'antd/es/table';
import { shortenAuthors, shortenString, getTagColor } from '../utils';
import ReviewModal from '../ReviewModal/ReviewModal';
import './SearchableReviewDisplay.scss';
import { Maybe, Review } from '../../types';

const { confirm } = Modal;

type SearchHandler = (q: string) => void;
type VoidHandler = () => void;

const handleModalDelete = (onOkHandler: VoidHandler) => {
  confirm({
    title: 'Are you sure delete this review?',
    content: "Once it's gone, it's gone forever!",
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk: onOkHandler,
  });
};

const renderReviews = (reviews: Review[], handleSearch: SearchHandler, reviewClicked: (review: Review) => void) => {
  const displaySettings = {
    titleStringLengthLimit: 150,
    journalStringLengthLimit: 30,
    oneSentenceStringLengthLimit: 80,
  };

  const columns: ColumnsType<Review> = [
    {
      title: 'Title',
      dataIndex: ['paper', 'title'],
      render: (title: string) => <span>{shortenString(title, displaySettings.titleStringLengthLimit)}</span>,
    },
    {
      title: 'One Sentence',
      dataIndex: ['paper', 'one_sentence'],
      render: (one_sentence: string) => (
        <span>{shortenString(one_sentence, displaySettings.oneSentenceStringLengthLimit)}</span>
      ),
    },
    {
      title: 'Authors',
      dataIndex: ['paper', 'authors'],
      render: (authorList: string[]) => <span>{shortenAuthors(authorList)}</span>,
    },
    {
      title: 'Year Published',
      dataIndex: ['paper', 'date'],
      render: (date: Date) => <span>{moment(date, 'YYYY-MM').format('YYYY')}</span>,
      sorter: (a: Review, b: Review) => moment(a.paper.date).diff(moment(b.paper.date)),
    },
    {
      title: 'Journal',
      dataIndex: ['paper', 'journal'],
      render: (journal: string) => <span>{shortenString(journal, displaySettings.journalStringLengthLimit)}</span>,
    },
    {
      title: 'Review Date',
      dataIndex: 'createdAt',
      render: (date: Date) => <span>{moment(date).format('MMMM Do, YYYY')}</span>,
      sorter: (a: Review, b: Review) => moment(a.createdAt).diff(moment(b.createdAt)),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Keywords',
      dataIndex: ['paper', 'keywords'],
      render: (keywords: string[]) => renderTags(keywords, handleSearch),
    },
  ];

  return (
    <Table
      onRow={(review, reviewIndex) => ({
        onClick: () => {
          reviewClicked(review);
        },
      })}
      rowKey={review => review._id!}
      columns={columns}
      dataSource={reviews}
      pagination={reviews.length > 10 && { position: ['bottomRight'] }}
    />
  );
};

const renderTags = (tags: string[], handleSearch: SearchHandler) => {
  let tagRender = null;

  if (tags && tags.length > 0) {
    tagRender = tags.map(tag => {
      if (tag === '') {
        return null;
      }
      return (
        <Tag
          color={getTagColor(tag)}
          onClick={e => {
            e.stopPropagation();
            // @ts-ignore
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
  return tagRender;
};

interface ModalProps {
  deleteConfirmHandler: VoidHandler;
  handleModalEdit: VoidHandler;
  handleModalCopy: VoidHandler;
  handleModalClose: VoidHandler;
  showModal: boolean;
  modalReview: Maybe<Review>;
  renderMath: boolean;
  itemName: string;
}

interface SearchableReviewDisplayViewProps {
  handleSearch: SearchHandler;
  reviewClicked: (review: Review) => void;
  query: string;
  reviews: Review[];
  modalProps: ModalProps;
  hideFooter: boolean;
  pageHeaderProps: { pageHeaderTitle: string; onPageBack: () => void };
}

export default function SearchableReviewDisplayView({
  handleSearch,
  reviewClicked,
  query,
  reviews,
  modalProps,
  hideFooter,
  pageHeaderProps,
}: SearchableReviewDisplayViewProps): JSX.Element {
  const {
    deleteConfirmHandler,
    handleModalEdit,
    handleModalCopy,
    handleModalClose,
    showModal,
    modalReview,
    renderMath,
    itemName,
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
  const modalFooter = [
    <Link to="/form" key="edit">
      <Button className="footer-btn" type="dashed" icon={<EditOutlined />} onClick={handleModalEdit}>
        Edit this {itemName}
      </Button>
    </Link>,
    <Button
      key="delete"
      type="dashed"
      className="footer-btn"
      icon={<DeleteOutlined />}
      onClick={() => handleModalDelete(deleteConfirmHandler)}
    >
      Delete this {itemName}
    </Button>,
  ];

  if (handleModalCopy) {
    const copyButton = (
      <Button key="copy" type="dashed" className="footer-btn" icon={<EditOutlined />} onClick={handleModalCopy}>
        ()){' '}
      </Button>
    );
    modalFooter.splice(0, 0, copyButton);
  }

  const footer = hideFooter ? null : modalFooter;
  reviewModal = (
    <ReviewModal
      review={modalReview}
      visible={showModal}
      renderMath={renderMath}
      onClose={handleModalClose}
      footer={footer}
    />
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

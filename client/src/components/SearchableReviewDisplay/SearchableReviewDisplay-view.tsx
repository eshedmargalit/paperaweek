import React from 'react';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, ReadOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Col, Input, Modal, PageHeader, Row, Table } from 'antd';
import moment from 'moment';
import { ColumnsType } from 'antd/es/table';
import { PageHeaderProps } from 'antd/lib/page-header';
import { shortenAuthors, shortenTableString, stringArrayHasNonEmpty } from '../utils';
import ReviewModal from '../ReviewModal/ReviewModal';
import NAText from '../NAText';
import './SearchableReviewDisplay.scss';
import { Review } from '../../types';
import TagList from '../TagList';

const { confirm } = Modal;

type SearchHandler = (q: string) => void;
type VoidHandler = () => void;

const renderTags = (tags: string[], handleSearch: SearchHandler): JSX.Element => {
  if (stringArrayHasNonEmpty(tags)) {
    return (
      <TagList
        tags={tags}
        onClick={e => {
          e.stopPropagation();
          const input = e.target as HTMLElement;
          handleSearch(`${input.innerHTML}`);
        }}
      />
    );
  }
  return <NAText />;
};

const handleModalDelete = (onOkHandler: VoidHandler) => {
  confirm({
    title: 'Are you sure you want to delete this entry?',
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
    tldrStringLengthLimit: 80,
  };

  const columns: ColumnsType<Review> = [
    {
      title: 'Title',
      dataIndex: ['paper', 'title'],
      render: (title: string) => shortenTableString(title, displaySettings.titleStringLengthLimit),
    },
    {
      title: 'One Sentence',
      dataIndex: ['notes', 'tldr'],
      render: (tldr: string) => shortenTableString(tldr, displaySettings.tldrStringLengthLimit),
    },
    {
      title: 'Authors',
      dataIndex: ['paper', 'authors'],
      render: (authorList: string[]) => shortenAuthors(authorList),
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
      render: (journal: string) => shortenTableString(journal, displaySettings.journalStringLengthLimit),
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
      dataIndex: ['notes', 'keywords'],
      render: (keywords: string[]) => renderTags(keywords, handleSearch),
    },
  ];

  return (
    <Table
      onRow={review => ({
        onClick: () => {
          reviewClicked(review);
        },
      })}
      // TODO: Create a type in which _id is required and use it here instead of Review
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      rowKey={review => review._id!}
      columns={columns}
      dataSource={reviews}
      pagination={reviews.length > 10 && { position: ['bottomRight'] }}
      scroll={{ x: '100%' }}
    />
  );
};

interface ModalProps {
  deleteConfirmHandler: VoidHandler;
  handleModalEdit?: VoidHandler;
  handleModalCopy?: VoidHandler;
  handleModalClose: VoidHandler;
  showModal: boolean;
  modalReview?: Review;
  itemName: string;
}

interface SearchableReviewDisplayViewProps {
  handleSearch: SearchHandler;
  reviewClicked: (review: Review) => void;
  query: string;
  reviews: Review[];
  modalProps: ModalProps;
  hideFooter: boolean;
  pageHeaderProps: PageHeaderProps;
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
    itemName,
  } = modalProps;

  const pageHeader: JSX.Element = (
    <PageHeader {...pageHeaderProps} avatar={pageHeaderProps.onBack ? undefined : { icon: <ReadOutlined /> }} />
  );

  const searchRow: JSX.Element = (
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
                  placeholder="Filter by title, author, one sentence summary, tags, and more"
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
      <Button key="copy" type="dashed" className="footer-btn" icon={<LinkOutlined />} onClick={handleModalCopy}>
        {' '}
        Copy Link
      </Button>
    );
    modalFooter.splice(0, 0, copyButton);
  }

  const footer = hideFooter ? null : modalFooter;

  const reviewsTable = renderReviews(reviews, handleSearch, reviewClicked);

  return (
    <>
      {searchRow}
      {reviewsTable}
      {modalReview && (
        <ReviewModal review={modalReview} visible={showModal} onClose={handleModalClose} footer={footer} />
      )}
    </>
  );
}

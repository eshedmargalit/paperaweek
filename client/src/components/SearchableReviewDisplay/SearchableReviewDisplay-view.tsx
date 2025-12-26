import React from 'react';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import ReviewModal from '../ReviewModal/ReviewModal';
import { PageHeaderProps } from '../utils/PageHeader';
import './SearchableReviewDisplay.scss';
import { Review } from '../../types';
import { SearchHandler, VoidHandler } from './types';
import ReviewTable from './components/ReviewTable';
import SearchRow from './components/SearchRow';

const { confirm } = Modal;

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

interface ModalProps {
  deleteConfirmHandler: VoidHandler;
  handleModalEdit?: VoidHandler;
  handleModalCopy?: VoidHandler;
  handleModalClose: VoidHandler;
  showModal: boolean;
  modalReview?: Review;
  itemName: string;
  allowCopy?: boolean;
  allowMutate?: boolean;
}

interface SearchableReviewDisplayViewProps {
  handleSearch: SearchHandler;
  reviewClicked: (review: Review) => void;
  query: string;
  reviews: Review[];
  modalProps: ModalProps;
  pageHeaderProps: PageHeaderProps;
}

export default function SearchableReviewDisplayView({
  handleSearch,
  reviewClicked,
  query,
  reviews,
  modalProps,
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
    allowCopy = true,
    allowMutate = true,
  } = modalProps;

  const buttons = [];

  if (allowMutate) {
    buttons.push(
      <Link to="/form" key="edit">
        <Button className="nested" type="dashed" icon={<EditOutlined />} onClick={handleModalEdit}>
          Edit this {itemName}
        </Button>
      </Link>,
      <Button
        key="delete"
        type="dashed"
        icon={<DeleteOutlined />}
        onClick={() => handleModalDelete(deleteConfirmHandler)}
      >
        Delete this {itemName}
      </Button>
    );
  }

  if (allowCopy && handleModalCopy) {
    const copyButton = (
      <Button key="copy" type="dashed" icon={<LinkOutlined />} onClick={handleModalCopy}>
        {' '}
        Copy Link
      </Button>
    );
    buttons.splice(0, 0, copyButton);
  }

  const modalButtons = <div className="modal-buttons">{buttons}</div>;

  return (
    <div>
      <SearchRow query={query} pageHeaderProps={pageHeaderProps} handleSearch={handleSearch} />
      <ReviewTable reviews={reviews} handleSearch={handleSearch} reviewClicked={reviewClicked} />
      {modalReview && (
        <ReviewModal review={modalReview} open={showModal} onClose={handleModalClose} buttons={modalButtons} />
      )}
    </div>
  );
}

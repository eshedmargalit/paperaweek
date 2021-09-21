import React from 'react';
import { Modal } from 'antd';

import { Maybe, Review } from '../../types';

import './ReviewModal.scss';
import ReviewDisplay from '../ReviewDisplay/ReviewDisplay';

export interface ReviewModalProps {
  review: Review;
  visible: boolean;
  onClose: VoidFunction;
  buttons: Maybe<JSX.Element>;
}

export default function ReviewModal({ review, visible, onClose, buttons }: ReviewModalProps): JSX.Element {
  const ModalTitle = () => (
    <div className="flex modal-title">
      {review.paper.title}
      {buttons}
    </div>
  );

  return (
    <Modal title={<ModalTitle />} visible={visible} onCancel={onClose} footer={null} destroyOnClose width="80%">
      <div className="review-modal">
        <ReviewDisplay review={review} showTitle={false} />
      </div>
    </Modal>
  );
}

import React, { useCallback, useState } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { debounce as _debounce } from 'lodash';
import { Redirect } from 'react-router-dom';
import { Moment } from 'moment';
import ReviewModal from '../ReviewModal/ReviewModal';
import PAWForm from './PAWForm';
import ReviewWizardView from './ReviewWizard-view';
import { Review, Maybe } from '../../types';

const MS_BETWEEN_DRAFT_SAVES = 5 * 1000;

interface ReviewWizardContainerProps {
  initialReview: Review;
  restartReview: (review: Review) => void;
  submitReview: (review: Review) => void;
  submitLoading: boolean;
  saveDraft: (draft: Review) => Promise<void>;
  autosaveStatus: string;
  lastSave: Maybe<Moment>;
}

export default function ReviewWizardContainer({
  initialReview,
  restartReview,
  submitReview,
  submitLoading,
  saveDraft,
  autosaveStatus,
  lastSave,
}: ReviewWizardContainerProps): JSX.Element {
  const [review, setReview] = useState<Review>(initialReview);
  const [showModal, setShowModal] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);

  const previewModal = (newReview: Review) => {
    setReview(newReview);
    setShowModal(true);
  };

  // save at most every 5 seconds
  const autosave = useCallback(
    _debounce(newReview => {
      saveDraft(newReview);
    }, MS_BETWEEN_DRAFT_SAVES),
    []
  );

  const onChangeHandler = (newReview: Review) => {
    setReview(newReview);
    autosave(newReview);
  };

  const form = <PAWForm initialReview={initialReview} onSubmit={previewModal} onChange={onChangeHandler} />;

  // what should happen if the review modal is exited?
  const onModalCancel = () => {
    restartReview(review);
    setShowModal(false);
  };

  // what should happen if modal is submitted?
  const handleSubmission = () => {
    submitReview(review);
    setRedirectHome(true);
  };

  const modalFooter = [
    <Button key="submit" type="primary" icon={<CheckOutlined />} onClick={handleSubmission} loading={submitLoading}>
      Looks good, submit!
    </Button>,
    <Button key="cancel" icon={<CloseOutlined />} onClick={onModalCancel} style={{ borderColor: 'red' }}>
      Cancel
    </Button>,
  ];

  const modal = (
    <div>
      <ReviewModal review={review} visible={showModal} onClose={onModalCancel} footer={modalFooter} renderMath />
    </div>
  );

  return redirectHome ? (
    <Redirect to="/dashboard" push />
  ) : (
    <ReviewWizardView
      form={form}
      modal={modal}
      autosaveStatus={autosaveStatus}
      lastSave={lastSave}
      onPageBack={() => setRedirectHome(true)}
    />
  );
}

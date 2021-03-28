import React, { useState, useCallback } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Redirect } from 'react-router-dom';
import { Moment } from 'moment';
import ReviewModal from '../ReviewModal/ReviewModal';
import ReviewWizardView from './ReviewWizard-view';
import { Review, Maybe } from '../../types';
import Form from './Form';

interface ReviewWizardContainerProps {
  initialReview: Review;
  submitReview: (review: Review) => Promise<void>;
  submitLoading: boolean;
  saveDraft: (draft: Review) => Promise<void>;
  autosaveStatus: string;
  lastSave: Maybe<Moment>;
  shouldShowHelp: boolean;
}

export default function ReviewWizardContainer({
  initialReview,
  submitReview,
  submitLoading,
  saveDraft,
  autosaveStatus,
  lastSave,
  shouldShowHelp,
}: ReviewWizardContainerProps): JSX.Element {
  const [review, setReview] = useState<Review>(initialReview);
  const [showModal, setShowModal] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);

  const previewModal = (newReview: Review) => {
    setReview(newReview);
    setShowModal(true);
  };

  const onChangeHandler = (newReview: Review) => {
    setReview(newReview);
    saveDraft(newReview);
  };

  const form = (
    <Form
      initialReview={initialReview}
      onSubmit={useCallback(previewModal, [])}
      onChange={useCallback(onChangeHandler, [])}
    />
  );

  // what should happen if the review modal is exited?
  const onModalCancel = () => {
    setShowModal(false);
  };

  // what should happen if modal is submitted?
  const handleSubmission = async () => {
    await submitReview(review);
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
      <ReviewModal review={review} visible={showModal} onClose={onModalCancel} footer={modalFooter} />
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
      shouldShowHelp={shouldShowHelp}
    />
  );
}

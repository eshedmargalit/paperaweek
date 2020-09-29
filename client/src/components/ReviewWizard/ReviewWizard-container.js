import React, { useCallback, useState } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import _ from 'lodash';
import { Redirect } from 'react-router-dom';
import ReviewModal from '../ReviewModal/ReviewModal';
import MetadataForm from './MetadataForm';
import ReviewForm from './ReviewForm';
import ReviewWizardView from './ReviewWizard-view';

const _MS_BETWEEN_DRAFT_SAVES = 5 * 1000;

export default function ReviewWizardContainer({
  initialPaper,
  initialReview,
  restartReview,
  submitReview,
  submitLoading,
  saveDraft,
  autosaveStatus,
  lastSave,
}) {
  // set state variables for paper and review
  const [paper, setPaper] = useState(initialPaper);
  const [review, setReview] = useState(initialReview);

  // set wizard state
  const [step, setStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);

  const submitMetadata = newPaper => {
    setPaper(newPaper);
    setStep(1);
  };

  const previewModal = newReview => {
    setReview(newReview);
    setStep(2);
    setShowModal(true);
  };

  // save at most every 5 seconds
  const autosave = useCallback(
    _.debounce((newPaper, newReview) => {
      saveDraft(newPaper, newReview);
    }, _MS_BETWEEN_DRAFT_SAVES),
    []
  );

  const paperOnChangeHandler = newPaper => {
    setPaper(newPaper);
    autosave(newPaper, review);
  };

  const reviewOnChangeHandler = newReview => {
    setReview(newReview);
    autosave(paper, newReview);
  };

  /*
   * onChange needs to be wrapped in useCallback, so it doesn't change on each render
   * However, we also need to pass [review] as a dependency, which means if review
   * DOES change, we should actually ask for a new function (because paperOnChangeHandler)
   * needs to read the new value of review
   */

  const metadataStep = (
    <MetadataForm
      paper={initialPaper}
      onSubmit={useCallback(submitMetadata, [])}
      onChange={useCallback(paperOnChangeHandler, [review])}
    />
  );
  const reviewStep = (
    <ReviewForm
      review={initialReview}
      onSubmit={useCallback(previewModal, [])}
      onChange={useCallback(reviewOnChangeHandler, [paper])}
    />
  );

  // what should happen if the review modal is exited?
  const onModalCancel = () => {
    restartReview({ paper, review });
    setStep(0);
    setShowModal(false);
  };

  // what should happen if modal is submitted?
  const handleSubmission = async () => {
    await submitReview({ paper, review });
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
      <ReviewModal review={{ paper, review }} visible={showModal} onClose={onModalCancel} footer={modalFooter} />
    </div>
  );
  const stepContent = [metadataStep, reviewStep, modal];

  return redirectHome ? (
    <Redirect to="/dashboard" push />
  ) : (
    <ReviewWizardView
      autosaveStatus={autosaveStatus}
      lastSave={lastSave}
      onPageBack={() => setRedirectHome(true)}
      currentStep={step}
      stepContent={stepContent[step]}
    />
  );
}

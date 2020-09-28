import React, { useCallback, useEffect, useState } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import _ from 'lodash';
import { Redirect } from 'react-router-dom';
import ReviewModal from '../ReviewModal/ReviewModal';
import MetadataForm from './MetadataForm';
import ReviewForm from './ReviewForm';
import ReviewWizardView from './ReviewWizard-view';
import { useIsMount } from '../../hooks.js';

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
  // figure out if this is the first render or not
  const isMount = useIsMount();
  console.log(isMount);

  // set state variables for paper and review
  const [paper, setPaper] = useState(initialPaper);
  const [review, setReview] = useState(initialReview);

  // set wizard state
  const [step, setStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);

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

  const getMetadata = newPaper => {
    setPaper(newPaper);
    setStep(1);
  };

  const getReview = newReview => {
    setReview(newReview);
    setStep(2);
    setShowModal(true);
  };

  const autosave = async () => {
    const reviewFromState = { paper, review };
    await saveDraft(reviewFromState);
  };

  // save at most every 5 seconds
  const debouncedAutosave = useCallback(_.debounce(autosave, 5 * 1000), []);

  // when paper or review changes, debounced autosave. Do not run on mount
  useEffect(() => {
    if (!isMount) {
      console.log('I want to autosave!');
      // debouncedAutosave();
    }
  }, [paper, review, debouncedAutosave, isMount]);

  const metadataStep = (
    <MetadataForm paper={initialPaper} onSubmit={useCallback(getMetadata, [])} onChange={useCallback(setPaper, [])} />
  );
  const reviewStep = (
    <ReviewForm review={initialReview} onSubmit={useCallback(getReview, [])} onChange={useCallback(setReview, [])} />
  );
  const modalFooter = [
    <Button key="submit" type="primary" icon={<CheckOutlined />} onClick={handleSubmission} loading={submitLoading}>
      Looks good, submit!
    </Button>,
    <Button key="cancel" icon={<CloseOutlined />} onClick={onModalCancel} style={{ borderColor: 'red' }}>
      Cancel
    </Button>,
  ];

  const reviewFromState = { paper, review };

  const modal = (
    <div>
      <ReviewModal review={reviewFromState} visible={showModal} onClose={onModalCancel} footer={modalFooter} />
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

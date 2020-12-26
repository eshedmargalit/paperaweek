import React, { useCallback, useState } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { debounce as _debounce } from 'lodash';
import { Redirect } from 'react-router-dom';
import { Moment } from 'moment';
import ReviewModal from '../ReviewModal/ReviewModal';
import PAWForm from './PAWForm';
import ReviewWizardView from './ReviewWizard-view';
import { Notes, Paper, Review, Maybe } from '../../types';

const MS_BETWEEN_DRAFT_SAVES = 5 * 1000;

interface ReviewWizardContainerProps {
  initialPaper: Paper;
  initialNotes: Notes;
  restartReview: (review: Review) => void;
  submitReview: (review: Review) => void;
  submitLoading: boolean;
  saveDraft: (paper: Paper, notes: Notes) => Promise<void>;
  autosaveStatus: string;
  lastSave: Maybe<Moment>;
}

export default function ReviewWizardContainer({
  initialPaper,
  initialNotes,
  restartReview,
  submitReview,
  submitLoading,
  saveDraft,
  autosaveStatus,
  lastSave,
}: ReviewWizardContainerProps): JSX.Element {
  // set state variables for paper and Notes
  const [paper, setPaper] = useState<Paper>(initialPaper);
  const [notes, setNotes] = useState<Notes>(initialNotes);

  // set wizard state
  const [showModal, setShowModal] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);

  const previewModal = (newValues: Review) => {
    setPaper(newValues.paper);
    setNotes(newValues.notes);
    setShowModal(true);
  };

  // save at most every 5 seconds
  const autosave = useCallback(
    _debounce((newPaper, newReview) => {
      saveDraft(newPaper, newReview);
    }, MS_BETWEEN_DRAFT_SAVES),
    []
  );

  const onChangeHandler = (newValues: Review) => {
    setPaper(newValues.paper);
    setNotes(newValues.notes);
    autosave(paper, notes);
  };

  /*
   * onChange needs to be wrapped in useCallback, so it doesn't change on each render
   * However, we also need to pass [review] as a dependency, which means if review
   * DOES change, we should actually ask for a new function (because paperOnChangeHandler)
   * needs to read the new value of review
   */

  const form = (
    <PAWForm
      initialPaper={initialPaper}
      initialNotes={initialNotes}
      onSubmit={useCallback(previewModal, [])}
      onChange={useCallback(onChangeHandler, [autosave])}
    />
  );

  // what should happen if the review modal is exited?
  const onModalCancel = () => {
    restartReview({ paper, notes });
    setShowModal(false);
  };

  // what should happen if modal is submitted?
  const handleSubmission = () => {
    submitReview({ paper, notes });
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
      <ReviewModal
        review={{ paper, notes }}
        visible={showModal}
        onClose={onModalCancel}
        footer={modalFooter}
        renderMath
      />
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

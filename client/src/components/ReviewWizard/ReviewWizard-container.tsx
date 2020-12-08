import React, { useCallback, useState } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import _ from 'lodash';
import { uniq as _uniq } from 'lodash';
import { Redirect } from 'react-router-dom';
import ReviewModal from '../ReviewModal/ReviewModal';
import PAWForm from './PAWForm';
import ReviewWizardView from './ReviewWizard-view';
import { PAWProps } from './types';
import { Notes, Paper, Review, Maybe } from '../../types';
import { Moment } from 'moment';

const _MS_BETWEEN_DRAFT_SAVES = 5 * 1000;

const parseKeywords = (keywords: string | string[]) => {
  if (Array.isArray(keywords)) {
    keywords = keywords.join(',');
  }
  return _uniq(
    keywords.split(',').map(item => {
      return item.trim().toLowerCase();
    })
  );
};

const repackageValues = (values: PAWProps): Review => ({
  paper: {
    title: values.title,
    authors: values.authors,
    institutions: values.institutions,
    date: values.date,
    journal: values.journal,
    doi: values.doi,
    url: values.url,
    keywords: parseKeywords(values.keywords || []),
    one_sentence: values.one_sentence,
  },
  notes: {
    background_points: values.background_points,
    approach_points: values.approach_points,
    results_points: values.results_points,
    conclusions_points: values.conclusions_points,
    summary_points: values.summary_points,
    other_points: values.other_points,
  },
});

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
}: ReviewWizardContainerProps) {
  // set state variables for paper and Notes
  const [paper, setPaper] = useState(initialPaper);
  const [notes, setNotes] = useState(initialNotes);

  // set wizard state
  const [showModal, setShowModal] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);

  const previewModal = (newValues: PAWProps) => {
    const { paper, notes } = repackageValues(newValues);
    setPaper(paper);
    setNotes(notes);
    setShowModal(true);
  };

  // save at most every 5 seconds
  const autosave = useCallback(
    _.debounce((newPaper, newReview) => {
      saveDraft(newPaper, newReview);
    }, _MS_BETWEEN_DRAFT_SAVES),
    []
  );

  const onChangeHandler = (newValues: PAWProps) => {
    const { paper, notes } = repackageValues(newValues);
    setPaper(paper);
    setNotes(notes);
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
      <ReviewModal review={{ paper, notes }} visible={showModal} onClose={onModalCancel} footer={modalFooter} />
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

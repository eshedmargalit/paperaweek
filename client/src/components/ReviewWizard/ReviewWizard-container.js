import React, { useCallback, useState } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import _ from 'lodash';
import { uniq as _uniq } from 'lodash';
import { Redirect } from 'react-router-dom';
import ReviewModal from '../ReviewModal/ReviewModal';
// import MetadataForm from './MetadataForm';
// import ReviewForm from './ReviewForm';
import PAWForm from './PAWForm';
import ReviewWizardView from './ReviewWizard-view';

const _MS_BETWEEN_DRAFT_SAVES = 5 * 1000;

const parseKeywords = keywords => {
  if (Array.isArray(keywords)) {
    keywords = keywords.join(',');
  }
  return _uniq(
    keywords.split(',').map(item => {
      return item.trim().toLowerCase();
    })
  );
};

function repackageValues(values) {
  return {
    paper: {
      title: values.title,
      authors: values.authors,
      institutions: values.institutions,
      date: values.date,
      journal: values.journal,
      doi: values.doi,
      url: values.url,
      keywords: parseKeywords(values.keywords),
      one_sentence: values.one_sentence,
    },
    review: {
      background_points: values.background_points,
      approach_points: values.approach_points,
      results_points: values.results_points,
      conclusions_points: values.conclusions_points,
      other_points: values.other_points,
    },
  };
}

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
  const [showModal, setShowModal] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);

  const previewModal = newValues => {
    const { paper, review } = repackageValues(newValues);
    setPaper(paper);
    setReview(review);
    setShowModal(true);
  };

  // save at most every 5 seconds
  const autosave = useCallback(
    _.debounce((newPaper, newReview) => {
      saveDraft(newPaper, newReview);
    }, _MS_BETWEEN_DRAFT_SAVES),
    []
  );

  const onChangeHandler = newValues => {
    const { paper, review } = repackageValues(newValues);
    setPaper(paper);
    setReview(review);
    autosave(paper, review);
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
      initialReview={initialReview}
      onSubmit={useCallback(previewModal)}
      onChange={useCallback(onChangeHandler, [paper, review])}
    />
  );

  // const metadataStep = (
  //   <MetadataForm
  //     paper={initialPaper}
  //     onSubmit={useCallback(submitMetadata, [])}
  //     onChange={useCallback(paperOnChangeHandler, [review])}
  //   />
  // );
  // const reviewStep = (
  //   <ReviewForm
  //     review={initialReview}
  //     onSubmit={useCallback(previewModal, [])}
  //     onChange={useCallback(reviewOnChangeHandler, [paper])}
  //   />
  // );

  // what should happen if the review modal is exited?
  const onModalCancel = () => {
    restartReview({ paper, review });
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

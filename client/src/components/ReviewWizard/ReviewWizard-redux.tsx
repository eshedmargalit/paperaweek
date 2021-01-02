import React, { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import ReviewWizardContainer from './ReviewWizard-container';
import { updateReadingList, updateReviews, setReview } from '../../actions/index';
import { blankNotes, blankPaper } from '../../templates';
import { useSaveDraft } from './hooks';
import { RootState } from '../../reducers';
import { Paper, Review } from '../../types';

export default function ReviewWizardRedux(): JSX.Element {
  const dispatch = useDispatch();

  const [submitLoading, setSubmitLoading] = useState(false);

  const activeReview: Review = useSelector((state: RootState) => state.activeReview);
  const readingList: Paper[] = useSelector((state: RootState) => state.readingList);

  const { deleteActiveDraft, saveDraft, autosaveStatus, lastSave } = useSaveDraft();

  // if the review is restarted, set the review in state to have no id, but keep
  // the contents
  const restartReview = (review: Review) => {
    dispatch(setReview(review));
  };

  const deleteReadingListEntry = async () => {
    const { _id } = activeReview;
    let newReadingList = readingList;

    if (_id) {
      newReadingList = readingList.filter(currPaper => currPaper._id !== _id);
    }

    // update reading list in global state
    dispatch(updateReadingList(newReadingList));

    // update reading list in DB and re-update global state
    const res = await axios.put('api/readingList', newReadingList);
    dispatch(updateReadingList(res.data));
  };

  const submitReview = async (review: Review) => {
    // start the submission spinner
    setSubmitLoading(true);

    const id = activeReview ? activeReview._id : null;

    const method = id ? 'put' : 'post';
    const url = '/api/reviews';
    const data = {
      review,
      id,
    };

    // send the request to the server
    const res = await axios({ method, url, data });

    if (res.status === 200) {
      dispatch(updateReviews(res.data));
      deleteActiveDraft();
      deleteReadingListEntry();
    }

    // turn off the submission spinner
    setSubmitLoading(false);
  };

  const { paper, notes } = activeReview;

  const initialPaper = { ...blankPaper, ...paper };
  const initialNotes = { ...blankNotes, ...notes };
  const initialReview = { paper: initialPaper, notes: initialNotes };

  return (
    <ReviewWizardContainer
      restartReview={restartReview}
      submitReview={submitReview}
      saveDraft={saveDraft}
      submitLoading={submitLoading}
      lastSave={lastSave}
      autosaveStatus={autosaveStatus}
      initialReview={initialReview}
    />
  );
}

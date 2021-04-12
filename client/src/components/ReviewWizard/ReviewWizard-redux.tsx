import React, { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import ReviewWizardContainer from './ReviewWizard-container';
import { fetchUser } from '../../actions/index';
import { blankNotes, blankPaper } from '../../templates';
import { useSaveDraft } from './hooks';
import { RootState } from '../../reducers';
import { Paper, Review } from '../../types';
import { useProtected } from '../../hooks/useProtected';
import { AuthState } from '../../reducers/reducer_auth';

export default function ReviewWizardRedux(): JSX.Element {
  useProtected();
  const dispatch = useDispatch();

  const [submitLoading, setSubmitLoading] = useState(false);

  const activeReview: Review = useSelector((state: RootState) => state.activeReview);
  const readingList: Paper[] = useSelector((state: RootState) => state.readingList);

  const { deleteActiveDraft, saveDraft, autosaveStatus, lastSave } = useSaveDraft();

  // determine if the user has no reviews or drafts and help should be shown on the form
  const { user, loading }: AuthState = useSelector((state: RootState) => state.auth);
  const shouldShowHelp = !loading && user.reviews.length + user.drafts.length === 0;

  const deleteReadingListEntry = async () => {
    const { _id } = activeReview.paper;
    let newReadingList = readingList;

    if (_id) {
      newReadingList = readingList.filter((currPaper) => currPaper._id !== _id);
    }

    // update reading list in DB and re-update global state
    await axios.put('api/readingList', newReadingList);
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
    const { status } = await axios({ method, url, data });

    if (status === 200) {
      await deleteActiveDraft();
      await deleteReadingListEntry();
      dispatch(fetchUser());
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
      submitReview={submitReview}
      saveDraft={saveDraft}
      submitLoading={submitLoading}
      lastSave={lastSave}
      autosaveStatus={autosaveStatus}
      initialReview={initialReview}
      shouldShowHelp={shouldShowHelp}
    />
  );
}

import React, { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import ReviewWizardContainer from './ReviewWizard-container';
import { updateReadingList, updateDrafts, updateDraftId, updateReviews, setReview } from '../../actions/index';
import moment from 'moment';
import { blankPaper, blankReview } from './utils.js';
import _ from 'lodash';

export default function ReviewWizardRedux() {
  const dispatch = useDispatch();

  const [submitLoading, setSubmitLoading] = useState(false);
  const [lastSave, setLastSave] = useState(null);
  const [autosaveStatus, setAutosaveStatus] = useState('unsaved');

  const activeReview = useSelector(state => state.activeReview);
  const activeDraft = useSelector(state => state.activeDraft);
  const readingList = useSelector(state => state.readingList);
  const drafts = useSelector(state => state.drafts);

  const { draftId } = activeDraft;
  console.log(`Rendered! Draft ID is ${draftId}`);

  // if the review is restarted, set the review in state to have no id, but keep
  // the contents
  const restartReview = reviewContent => {
    dispatch(setReview(null, reviewContent));
  };

  // if there is an active draft in the redux state, invoking this method will delete
  // it from state + DB
  const deleteActiveDraft = async () => {
    if (draftId && drafts) {
      const newDrafts = drafts.filter(currDraft => {
        return currDraft._id !== draftId;
      });

      dispatch(updateDrafts(newDrafts));
      let res = await axios.delete(`api/drafts/${draftId}`);
      dispatch(updateDrafts(res.data));
    }
  };

  const deleteReadingListEntry = async () => {
    const { paperId } = activeReview;
    let newReadingList = readingList;

    if (paperId) {
      newReadingList = readingList.filter(currPaper => {
        return currPaper._id !== paperId;
      });
    }

    // update reading list in global state
    dispatch(updateReadingList(newReadingList));

    // update reading list in DB and re-update global state
    let res = await axios.put('api/readingList', newReadingList);
    dispatch(updateReadingList(res.data));
  };

  const saveDraft = async draft => {
    console.log('Saving draft! Here is the draft content:');
    console.log(draft);

    const method = draftId ? 'put' : 'post';
    const url = '/api/drafts';
    console.log(`The draft id is ${draftId}, so I want to ${method} to ${url}`);

    const data = {
      draft: draft,
      id: draftId,
    };

    console.log('Here are the datat I want to post');
    console.log(data);

    const res = await axios({ method, url, data });

    console.log('Heres the response I got from the server');
    console.log(res);

    if (res.status === 200) {
      const returnedDraft = res.data;
      setAutosaveStatus('saved');
      setLastSave(moment());
      dispatch(updateDraftId(returnedDraft._id));
    } else {
      setAutosaveStatus('saveFailed');
      setLastSave(null);
    }
  };

  const submitReview = async reviewObject => {
    // start the submission spinner
    setSubmitLoading(true);

    let reviewId;
    if (activeReview.reviewContent) {
      reviewId = activeReview.reviewContent._id;
    }

    const method = reviewId ? 'put' : 'post';
    const url = '/api/papers';
    const data = {
      review: reviewObject,
      id: reviewId,
    };

    // send the request to the server
    let res = await axios({ method, url, data });

    if (res.status === 200) {
      dispatch(updateReviews(res.data));
      deleteActiveDraft();
      deleteReadingListEntry();
    }

    // turn off the submission spinner
    setSubmitLoading(false);
  };

  // figure out if we already have a paper or a review
  let { paperId, reviewContent } = activeReview;

  // always use the paperId if it exists, if not fall back to raw review (without a paper id)
  let paper;
  let review;

  if (paperId) {
    paper = _.find(readingList, { _id: paperId });
  } else if (reviewContent) {
    ({ paper, review } = reviewContent);
  }

  // set initial paper and review
  const initialPaper = paper || blankPaper;
  const initialReview = review || blankReview;

  return (
    <ReviewWizardContainer
      restartReview={restartReview}
      submitReview={submitReview}
      saveDraft={saveDraft}
      submitLoading={submitLoading}
      lastSave={lastSave}
      autosaveStatus={autosaveStatus}
      initialPaper={initialPaper}
      initialReview={initialReview}
    />
  );
}

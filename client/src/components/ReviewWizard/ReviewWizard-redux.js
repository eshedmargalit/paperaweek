import React, { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import ReviewWizardContainer from './ReviewWizard-container';
import { updateReadingList, updateReviews, setReview } from '../../actions/index';
import { blankPaper, blankReview } from './utils.js';
import _ from 'lodash';
import moment from 'moment';
import { useSaveDraft } from './hooks.js';

export default function ReviewWizardRedux() {
  const dispatch = useDispatch();

  const [submitLoading, setSubmitLoading] = useState(false);

  const activeReview = useSelector(state => state.activeReview);
  const readingList = useSelector(state => state.readingList);

  const { deleteActiveDraft, saveDraft, autosaveStatus, lastSave } = useSaveDraft();

  // if the review is restarted, set the review in state to have no id, but keep
  // the contents
  const restartReview = reviewContent => {
    const reviewId = null;
    dispatch(setReview(reviewId, reviewContent));
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

  const submitReview = async reviewObject => {
    // start the submission spinner
    setSubmitLoading(true);

    const reviewId = activeReview.reviewContent ? activeReview.reviewContent._id : null;

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
  // spread operator makes second argument overwrite first in case of key conflict
  // this approach guarantees the initial object contains all necessary keys
  const initialPaper = { ...blankPaper, ...paper };
  const initialReview = { ...blankReview, ...review };

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

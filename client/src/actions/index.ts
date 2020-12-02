import axios from 'axios';
import { Dispatch } from 'redux';

import {
  FETCH_USER,
  UPDATE_DRAFTS,
  UPDATE_DRAFT_ID,
  UPDATE_READING_LIST,
  UPDATE_REVIEWS,
  SET_REVIEW,
} from './actionTypes';

import { User, FetchUserAction } from './types';

export const fetchUser = () => async (dispatch: Dispatch<FetchUserAction>) => {
  let user = await axios.get<User>('/api/current_user');

  if (!user.data) {
    return;
  }
  dispatch({ type: FETCH_USER, payload: user.data });
};

// @ts-ignore
export function setReview(paperId, reviewContent) {
  return {
    type: SET_REVIEW,
    payload: { paperId, reviewContent },
  };
}

// @ts-ignore
export function updateDraftId(draftId) {
  return {
    type: UPDATE_DRAFT_ID,
    payload: { draftId },
  };
}

// @ts-ignore
export function updateDrafts(newDrafts) {
  return {
    type: UPDATE_DRAFTS,
    payload: newDrafts,
  };
}

// @ts-ignore
export function updateReadingList(newReadingList) {
  return {
    type: UPDATE_READING_LIST,
    payload: newReadingList,
  };
}

// @ts-ignore
export function updateReviews(newReviews) {
  return {
    type: UPDATE_REVIEWS,
    payload: newReviews,
  };
}

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

import { FetchUserAction, SetReviewAction } from './types';
import { Maybe, MongoID, Paper, Review, User } from '../types';

export const fetchUser = () => async (dispatch: Dispatch<FetchUserAction>) => {
  let user = await axios.get<User>('/api/current_user');

  if (!user.data) {
    return;
  }
  dispatch({ type: FETCH_USER, payload: user.data });
};

export const setReview = (review: Review): SetReviewAction => ({
  type: SET_REVIEW,
  payload: review,
});

export const updateDraftId = (draftId: Maybe<MongoID>) => ({
  type: UPDATE_DRAFT_ID,
  payload: draftId,
});

export const updateDrafts = (newDrafts: Review[]) => ({
  type: UPDATE_DRAFTS,
  payload: newDrafts,
});

export const updateReadingList = (newReadingList: Paper[]) => {
  return {
    type: UPDATE_READING_LIST,
    payload: newReadingList,
  };
};

export const updateReviews = (newReviews: Review[]) => {
  return {
    type: UPDATE_REVIEWS,
    payload: newReviews,
  };
};

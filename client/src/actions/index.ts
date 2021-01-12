import axios from 'axios';
import { Dispatch } from 'redux';

import {
  FETCH_USER,
  UPDATE_DRAFTS,
  UPDATE_DRAFT_ID,
  UPDATE_READING_LIST,
  UPDATE_REVIEWS,
  SET_REVIEW,
  FETCH_USER_LOADING,
  FETCH_USER_FAILED,
} from './actionTypes';

import {
  AuthReducerAction,
  SetReviewAction,
  UpdateDraftIdAction,
  UpdateDraftsAction,
  UpdateReadingListAction,
  UpdateReviewsAction,
} from './types';
import { Maybe, MongoID, Paper, Review } from '../types';
import { UserResponse, constructUserFromResponse } from '../dtos';

export const fetchUser = () => async (dispatch: Dispatch<AuthReducerAction>): Promise<void> => {
  dispatch({ type: FETCH_USER_LOADING });

  const userResponse = await axios.get<UserResponse>('/api/current_user');

  if (!userResponse.data) {
    dispatch({ type: FETCH_USER_FAILED });
    return;
  }
  const user = constructUserFromResponse(userResponse.data);

  dispatch({ type: FETCH_USER, payload: user });
};

export const setReview = (review: Review): SetReviewAction => ({
  type: SET_REVIEW,
  payload: review,
});

export const updateDraftId = (draftId: Maybe<MongoID>): UpdateDraftIdAction => ({
  type: UPDATE_DRAFT_ID,
  payload: draftId,
});

export const updateDrafts = (newDrafts: Review[]): UpdateDraftsAction => ({
  type: UPDATE_DRAFTS,
  payload: newDrafts,
});

export const updateReadingList = (newReadingList: Paper[]): UpdateReadingListAction => ({
  type: UPDATE_READING_LIST,
  payload: newReadingList,
});

export const updateReviews = (newReviews: Review[]): UpdateReviewsAction => ({
  type: UPDATE_REVIEWS,
  payload: newReviews,
});

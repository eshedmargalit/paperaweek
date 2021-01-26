import { Maybe, MongoID, Paper, Review, User } from '../types';
import {
  FETCH_USER,
  FETCH_USER_FAILED,
  FETCH_USER_LOADING,
  SET_REVIEW,
  UPDATE_DRAFTS,
  UPDATE_DRAFT_ID,
  UPDATE_READING_LIST,
  UPDATE_REVIEWS,
} from './actionTypes';

export interface FetchUserAction {
  type: typeof FETCH_USER;
  payload: User;
}

export interface FetchUserLoadingAction {
  type: typeof FETCH_USER_LOADING;
}

export interface FetchUserFailedAction {
  type: typeof FETCH_USER_FAILED;
}

export type AuthReducerAction = FetchUserAction | FetchUserLoadingAction | FetchUserFailedAction;

export interface SetReviewAction {
  type: typeof SET_REVIEW;
  payload: Review;
}

export interface UpdateDraftIdAction {
  type: typeof UPDATE_DRAFT_ID;
  payload: Maybe<MongoID>;
}

export interface UpdateDraftsAction {
  type: typeof UPDATE_DRAFTS;
  payload: Review[];
}

export interface UpdateReadingListAction {
  type: typeof UPDATE_READING_LIST;
  payload: Paper[];
}

export interface UpdateReviewsAction {
  type: typeof UPDATE_REVIEWS;
  payload: Review[];
}

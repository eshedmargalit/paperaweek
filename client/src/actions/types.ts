import { Paper, Review, User } from '../types';
import {
  ENTER_DEMO_MODE,
  FETCH_USER,
  FETCH_USER_FAILED,
  FETCH_USER_LOADING,
  UPDATE_DRAFTS,
  UPDATE_READING_LIST,
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

export interface EnterDemoModeAction {
  type: typeof ENTER_DEMO_MODE;
}

export type AuthReducerAction = FetchUserAction | FetchUserLoadingAction | FetchUserFailedAction | EnterDemoModeAction;

export interface UpdateDraftsAction {
  type: typeof UPDATE_DRAFTS;
  payload: Review[];
}

export interface UpdateReadingListAction {
  type: typeof UPDATE_READING_LIST;
  payload: Paper[];
}

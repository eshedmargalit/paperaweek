import axios from 'axios';
import { Dispatch } from 'redux';

import {
  FETCH_USER,
  UPDATE_DRAFTS,
  UPDATE_READING_LIST,
  FETCH_USER_LOADING,
  FETCH_USER_FAILED,
  ENTER_DEMO_MODE,
} from './actionTypes';

import { AuthReducerAction, EnterDemoModeAction, UpdateDraftsAction, UpdateReadingListAction } from './types';
import { Paper, Review } from '../types';
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

export const enterDemoMode = (): EnterDemoModeAction => ({
  type: ENTER_DEMO_MODE,
});

export const updateDrafts = (newDrafts: Review[]): UpdateDraftsAction => ({
  type: UPDATE_DRAFTS,
  payload: newDrafts,
});

export const updateReadingList = (newReadingList: Paper[]): UpdateReadingListAction => ({
  type: UPDATE_READING_LIST,
  payload: newReadingList,
});

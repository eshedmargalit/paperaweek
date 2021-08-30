import { Reducer } from 'redux';
import { ENTER_DEMO_MODE, FETCH_USER, UPDATE_READING_LIST } from '../actions/actionTypes';
import { EnterDemoModeAction, FetchUserAction, UpdateReadingListAction } from '../actions/types';
import { demoUser } from '../templates';
import { Paper } from '../types';

const initialState: Paper[] = [];

const reducer: Reducer<Paper[], FetchUserAction | UpdateReadingListAction | EnterDemoModeAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case UPDATE_READING_LIST:
      return action.payload;
    case FETCH_USER:
      return action.payload ? action.payload.readingList : state;
    case ENTER_DEMO_MODE:
      return demoUser.readingList;
    default:
      return state;
  }
};

export default reducer;

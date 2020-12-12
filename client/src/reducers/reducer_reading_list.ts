import { Reducer } from 'redux';
import { FETCH_USER, UPDATE_READING_LIST } from '../actions/actionTypes';
import { FetchUserAction, UpdateReadingListAction } from '../actions/types';
import { Paper } from '../types';

const initialState: Paper[] = [];

const reducer: Reducer<Paper[], FetchUserAction | UpdateReadingListAction> = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_READING_LIST:
      return action.payload;
    case FETCH_USER:
      return action.payload ? action.payload.readingList : state;
    default:
      return state;
  }
};

export default reducer;

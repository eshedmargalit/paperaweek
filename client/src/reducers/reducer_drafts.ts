import { Reducer } from 'redux';
import { FETCH_USER, UPDATE_DRAFTS } from '../actions/actionTypes';
import { FetchUserAction, UpdateDraftsAction } from '../actions/types';
import { Review } from '../types';

const initialState: Review[] = [];

const reducer: Reducer<Review[], UpdateDraftsAction | FetchUserAction> = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_DRAFTS:
      return action.payload;
    case FETCH_USER:
      return action.payload ? action.payload.drafts : state;
    default:
      return state;
  }
};

export default reducer;

import { FETCH_USER, UPDATE_DRAFTS } from '../actions/actionTypes';
import { FetchUserAction, UpdateDraftsAction } from '../actions/types';
import { Review } from '../types';

const initialState: Review[] = [];

const reducer = (state = initialState, action: UpdateDraftsAction | FetchUserAction) => {
  switch (action.type) {
    case FETCH_USER:
      if (action.payload) {
        return action.payload.drafts;
      } else {
        return state;
      }
    case UPDATE_DRAFTS:
      return action.payload;
    default:
      return state;
  }
};

export default reducer;

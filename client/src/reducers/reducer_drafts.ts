import { FETCH_USER, UPDATE_DRAFTS } from '../actions/actionTypes';
import { FetchUserAction, UpdateDraftsAction } from '../actions/types';
import { Review, User } from '../types';

const initialState: Review[] = [];

const reducer = (state = initialState, action: UpdateDraftsAction | FetchUserAction) => {
  let { type, payload } = action;
  switch (type) {
    case FETCH_USER:
      if (payload) {
        return (payload as User).drafts;
      } else {
        return state;
      }
    case UPDATE_DRAFTS:
      return payload;
    default:
      return state;
  }
};

export default reducer;

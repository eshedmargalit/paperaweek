import { FETCH_USER } from '../actions/actionTypes';
import { FetchUserAction } from '../actions/types';
import { User } from '../types';

const initialState: User = {
  displayName: '',
  reviews: [],
  readingList: [],
  drafts: [],
  publicProfile: false,
  renderMath: false,
};

const reducer = (state = initialState, action: FetchUserAction) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_USER:
      if (payload) {
        return payload;
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default reducer;

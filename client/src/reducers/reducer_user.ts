import { FetchUserAction, FETCH_USER, User } from '../actions/user/types';

const initialState: User = {
  displayName: '',
  reviews: [],
  readingList: [],
  drafts: [],
  publicProfile: false,
  renderMath: false,
};

const reducer = (state = initialState, action: FetchUserAction) => {
  let { type, payload } = action;
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

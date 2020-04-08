import { FETCH_USER } from '../actions/index';
const initialState = {
  displayName: '',
  reviews: [],
  readingList: [],
  drafts: [],
  lastLogin: null,
};

const reducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case FETCH_USER:
      if (payload) {
        // maybe just return payload?
        let { displayName, reviews, readingList, drafts, lastLogin } = payload;
        return { displayName, reviews, readingList, drafts, lastLogin };
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default reducer;

import { FETCH_USER } from '../actions/index';
const initialState = {
  displayName: '',
  reviews: [],
  readingList: [],
  drafts: [],
  lastLogin: null,
  publicProfile: false,
  renderMath: false,
};

const reducer = (state = initialState, action) => {
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

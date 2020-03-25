import { FETCH_USER } from '../actions/index';
const initialState = {
  displayName: '',
};

const reducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case FETCH_USER:
      if (payload) {
        let { displayName, reviews, readingList, drafts } = payload;
        return { displayName, reviews, readingList, drafts };
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default reducer;

import { FETCH_USER } from '../actions/index';
const initialState = {
  displayName: '',
};

const reducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case FETCH_USER:
      let { displayName, reviews, readingList, drafts } = payload;
      return { displayName, reviews, readingList, drafts };
    default:
      return state;
  }
};

export default reducer;

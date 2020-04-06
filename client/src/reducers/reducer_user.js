import { FETCH_USER, GIVE_POINTS } from '../actions/index';
const initialState = {
  displayName: '',
  points: 0,
  reviews: [],
  readingList: [],
  drafts: [],
};

const reducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case FETCH_USER:
      if (payload) {
        // maybe just return payload?
        let { displayName, reviews, readingList, drafts, points } = payload;
        points = points || 0;
        return { displayName, reviews, readingList, drafts, points };
      } else {
        return state;
      }
    case GIVE_POINTS:
      let { newPoints } = payload;
      return { ...state, points: newPoints };
    default:
      return state;
  }
};

export default reducer;

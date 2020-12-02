import { FETCH_USER, UPDATE_DRAFTS } from '../actions';
const initialState = [];

const reducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case FETCH_USER:
      if (payload) {
        return payload.drafts;
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

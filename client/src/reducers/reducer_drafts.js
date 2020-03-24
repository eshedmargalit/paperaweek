import { FETCH_USER, UPDATE_DRAFTS } from '../actions/index';
const initialState = [];

const reducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case FETCH_USER:
      return payload.drafts;
    case UPDATE_DRAFTS:
      return payload;
    default:
      return state;
  }
};

export default reducer;

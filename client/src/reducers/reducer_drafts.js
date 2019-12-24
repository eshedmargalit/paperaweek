import { UPDATE_DRAFTS } from '../actions/index';
const initialState = [];

const reducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case UPDATE_DRAFTS:
      return payload;
    default:
      return state;
  }
};

export default reducer;

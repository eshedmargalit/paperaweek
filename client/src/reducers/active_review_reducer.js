import { SET_REVIEW } from '../actions/index';

const initialState = {
  paperId: null,
  reviewContent: null,
};

const reducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case SET_REVIEW:
      return { ...payload };
    default:
      return state;
  }
};

export default reducer;

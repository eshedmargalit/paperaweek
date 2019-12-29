import { START_REVIEW, END_REVIEW } from '../actions/index';

const initialState = {
  paperId: null,
  reviewContent: null,
  showForm: false,
};

const reducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case START_REVIEW:
      return { ...payload, showForm: true };
    case END_REVIEW:
      return { paperId: null, reviewContent: null, showForm: false };
    default:
      return state;
  }
};

export default reducer;

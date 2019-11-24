import { START_REVIEW, EXIT_FORM } from '../actions/index';

const initialState = {
  review: {},
  displayForm: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case START_REVIEW:
      return Object.assign({}, state, {
        review_object: action.review,
        displayForm: true,
      });
    case EXIT_FORM:
      return Object.assign({}, state, {
        displayForm: false,
      });
    default:
      return state;
  }
};

export default reducer;

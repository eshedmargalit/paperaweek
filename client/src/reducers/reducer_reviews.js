import { UPDATE_REVIEWS } from '../actions/index';
const initialState = {
  reviewList: [],
  loading: true,
};

const reducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case UPDATE_REVIEWS:
      return { loading: false, reviewList: payload };
    default:
      return state;
  }
};

export default reducer;

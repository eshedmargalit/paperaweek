import { UPDATE_REVIEWS, FETCH_USER } from '../actions/index';
const initialState = {
  reviewList: [],
  loading: true,
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_REVIEWS:
      return { loading: false, reviewList: payload };
    case FETCH_USER:
      if (payload) {
        return { loading: false, reviewList: payload.reviews };
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default reducer;

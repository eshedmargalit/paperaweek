import { UPDATE_REVIEWS, FETCH_USER } from '../actions/actionTypes';
import { FetchUserAction, UpdateReviewsAction } from '../actions/types';
import { Review } from '../types';

const initialState: { reviewList: Review[]; loading: boolean } = {
  reviewList: [],
  loading: true,
};

const reducer = (state = initialState, action: FetchUserAction | UpdateReviewsAction) => {
  switch (action.type) {
    case UPDATE_REVIEWS:
      return { loading: false, reviewList: action.payload };
    case FETCH_USER:
      return action.payload ? { loading: false, reviewList: action.payload.readingList } : state;
    default:
      return state;
  }
};

export default reducer;

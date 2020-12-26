import { Reducer } from 'redux';
import { UPDATE_REVIEWS, FETCH_USER } from '../actions/actionTypes';
import { FetchUserAction, UpdateReviewsAction } from '../actions/types';
import { Review } from '../types';

export interface LoadingReviewList {
  reviewList: Review[];
  loading: boolean;
}

const initialState: LoadingReviewList = {
  reviewList: [],
  loading: true,
};

const reducer: Reducer<LoadingReviewList, FetchUserAction | UpdateReviewsAction> = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_REVIEWS:
      return { loading: false, reviewList: action.payload };
    case FETCH_USER:
      return action.payload ? { loading: false, reviewList: action.payload.reviews } : state;
    default:
      return state;
  }
};

export default reducer;

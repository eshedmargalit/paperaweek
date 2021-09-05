import { Reducer } from 'redux';
import { FETCH_USER, ENTER_DEMO_MODE } from '../actions/actionTypes';
import { EnterDemoModeAction, FetchUserAction } from '../actions/types';
import { demoUser } from '../templates';
import { Review } from '../types';

export interface LoadingReviewList {
  reviewList: Review[];
  loading: boolean;
}

const initialState: LoadingReviewList = {
  reviewList: [],
  loading: true,
};

const reducer: Reducer<LoadingReviewList, FetchUserAction | EnterDemoModeAction> = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_REVIEWS:
      return { loading: false, reviewList: action.payload };
    case FETCH_USER:
      return action.payload ? { loading: false, reviewList: action.payload.reviews } : state;
    case ENTER_DEMO_MODE:
      return { loading: false, reviewList: demoUser.reviews };
    default:
      return state;
  }
};

export default reducer;

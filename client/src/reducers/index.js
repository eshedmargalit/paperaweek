import { combineReducers } from 'redux';
import ReducerReviewForm from './reducer_review_form';
import ReadingListReducer from './reducer_reading_list';
import ReducerReviews from './reducer_reviews';
import ReducerUser from './reducer_user';
import ActiveReviewReducer from './active_review_reducer';
import CarouselItemsReducer from './carousel_items_reducer';

const rootReducer = combineReducers({
  user: ReducerUser,
  reviews: ReducerReviews,
  reviewData: ReducerReviewForm,
  readingList: ReadingListReducer,
  activeReview: ActiveReviewReducer,
  carouselItems: CarouselItemsReducer,
});

export default rootReducer;

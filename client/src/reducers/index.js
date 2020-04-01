import { combineReducers } from 'redux';
import ReducerReviewForm from './reducer_review_form';
import ReadingListReducer from './reducer_reading_list';
import DraftsReducer from './reducer_drafts';
import ReducerReviews from './reducer_reviews';
import ReducerUser from './reducer_user';
import ReducerAuth from './reducer_auth';
import ActiveReviewReducer from './active_review_reducer';
import ActiveDraftReducer from './active_draft_reducer';
import CarouselItemsReducer from './carousel_items_reducer';

const rootReducer = combineReducers({
  auth: ReducerAuth,
  user: ReducerUser,
  reviews: ReducerReviews,
  reviewData: ReducerReviewForm,
  readingList: ReadingListReducer,
  drafts: DraftsReducer,
  activeReview: ActiveReviewReducer,
  activeDraft: ActiveDraftReducer,
  carouselItems: CarouselItemsReducer,
});

export default rootReducer;

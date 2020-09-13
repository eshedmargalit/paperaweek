import { combineReducers } from 'redux';
import ReadingListReducer from './reducer_reading_list';
import DraftsReducer from './reducer_drafts';
import ReducerReviews from './reducer_reviews';
import ReducerUser from './reducer_user';
import ReducerPoints from './reducer_points';
import ReducerAuth from './reducer_auth';
import ActiveReviewReducer from './active_review_reducer';
import ActiveDraftReducer from './active_draft_reducer';
import CarouselItemsReducer from './carousel_items_reducer';

const rootReducer = combineReducers({
  auth: ReducerAuth,
  user: ReducerUser,
  points: ReducerPoints,
  reviews: ReducerReviews,
  readingList: ReadingListReducer,
  drafts: DraftsReducer,
  activeReview: ActiveReviewReducer,
  activeDraft: ActiveDraftReducer,
  carouselItems: CarouselItemsReducer,
});

export default rootReducer;

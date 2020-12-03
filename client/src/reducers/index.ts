import { combineReducers } from 'redux';
import ReadingListReducer from './reducer_reading_list';
import DraftsReducer from './reducer_drafts';
import ReducerReviews from './reducer_reviews';
import ReducerAuth from './reducer_auth';
import ReducerUser from './reducer_user';
import ActiveReviewReducer from './active_review_reducer';
import ActiveDraftReducer from './active_draft_reducer';

export default combineReducers({
  auth: ReducerAuth,
  user: ReducerUser,
  reviews: ReducerReviews,
  readingList: ReadingListReducer,
  drafts: DraftsReducer,
  activeReview: ActiveReviewReducer,
  activeDraft: ActiveDraftReducer,
});

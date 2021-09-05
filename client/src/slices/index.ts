import { combineReducers } from '@reduxjs/toolkit';

import activeDraftReducer from './activeDraftSlice';
import activeReviewReducer from './activeReviewSlice';
import authReducer from './authSlice';
import draftsReducer from './draftsSlice';
import readingListReducer from './readingListSlice';
import reviewsReducer from './reviewsSlice';
import userReducer from './userSlice';

const rootReducer = combineReducers({
  activeDraft: activeDraftReducer,
  activeReview: activeReviewReducer,
  auth: authReducer,
  drafts: draftsReducer,
  readingList: readingListReducer,
  reviews: reviewsReducer,
  user: userReducer,
});

export default rootReducer;

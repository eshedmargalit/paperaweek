import { configureStore } from '@reduxjs/toolkit';
import activeDraftReducer from './slices/activeDraftSlice';
import activeReviewReducer from './slices/activeReviewSlice';
import authReducer from './slices/authSlice';
import draftsReducer from './slices/draftsSlice';
import readingListReducer from './slices/readingListSlice';
import reviewsReducer from './slices/reviewsSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    activeDraft: activeDraftReducer,
    activeReview: activeReviewReducer,
    auth: authReducer,
    drafts: draftsReducer,
    readingList: readingListReducer,
    reviews: reviewsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

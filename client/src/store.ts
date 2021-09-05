import { configureStore } from '@reduxjs/toolkit';
import activeDraftReducer from './slices/activeDraftSlice';

const store = configureStore({
  reducer: {
    activeDraft: activeDraftReducer,
  },
});

export default store;

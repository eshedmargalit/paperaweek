import { createSlice } from '@reduxjs/toolkit';
import { demoUser } from '../templates';
import { Review } from '../types';

import { enterDemoMode, fetchUser } from '../actions';

export interface ReviewListState {
  reviewList: Review[];
  loading: boolean;
}

const initialState: ReviewListState = {
  reviewList: [],
  loading: true,
};

export const reviewsSlice = createSlice({
  name: 'reviewList',
  initialState,
  reducers: {
    updateReviews: (_state, { payload }) => ({ loading: false, reviewList: payload }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) =>
        action.payload ? { loading: false, reviewList: action.payload.reviews } : state
      )
      .addCase(enterDemoMode, () => ({ loading: false, reviewList: demoUser.reviews }));
  },
});

export const { updateReviews } = reviewsSlice.actions;

export default reviewsSlice.reducer;

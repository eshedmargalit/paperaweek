import { createSlice } from '@reduxjs/toolkit';
import { Review } from '../types';
import { blankPaper, blankNotes } from '../templates';

export type ActiveReviewState = Review;

const initialState: ActiveReviewState = { paper: blankPaper, notes: blankNotes };

export const activeReviewSlice = createSlice({
  name: 'activeReview',
  initialState,
  reducers: {
    setActiveReview: (_state, { payload }) => payload,
  },
});

export const { setActiveReview } = activeReviewSlice.actions;

export default activeReviewSlice.reducer;

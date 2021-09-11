import { createSlice } from '@reduxjs/toolkit';
import { enterDemoMode, fetchUser } from '../actions';
import { demoUser } from '../templates';
import { Paper } from '../types';

export type ReadlingListState = Paper[];
const initialState: ReadlingListState = [];

export const readingListSlice = createSlice({
  name: 'readingList',
  initialState,
  reducers: {
    updateReadingList: (_state, { payload }) => payload,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => (action.payload ? action.payload.readingList : state))
      .addCase(enterDemoMode, () => demoUser.readingList);
  },
});

export const { updateReadingList } = readingListSlice.actions;

export default readingListSlice.reducer;

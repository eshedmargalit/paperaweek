import { createSlice } from '@reduxjs/toolkit';
import { fetchUser } from '../actions';
import { Review } from '../types';

export type DraftState = Review[];

const initialState: Review[] = [];

const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    updateDrafts: (_state, { payload }) => payload,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => (action.payload ? action.payload.drafts : state));
  },
});

export const { updateDrafts } = draftsSlice.actions;

export default draftsSlice.reducer;

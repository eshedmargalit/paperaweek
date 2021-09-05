import { createSlice } from '@reduxjs/toolkit';
import { Maybe, MongoID } from '../types';

export type ActiveDraftState = Maybe<MongoID>;

const initialState: ActiveDraftState = null;

export const activeDraftSlice = createSlice({
  name: 'activeDraft',
  initialState,
  reducers: {
    updateDraftId: (_state, { payload }) => payload,
  },
});

// Action creators are generated for each case reducer function
export const { updateDraftId } = activeDraftSlice.actions;

export default activeDraftSlice.reducer;

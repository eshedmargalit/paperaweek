import { createSlice } from '@reduxjs/toolkit';
import { enterDemoMode, fetchUser } from '../actions';
import { blankUser, demoUser } from '../templates';
import { User } from '../types';

const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutes

function isLessThanFiveMinOld(user: User) {
  const now = new Date();
  const age = now.valueOf() - new Date(user.createdAt).valueOf();
  return age <= FIVE_MINUTES;
}

const initialState: User = blankUser;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        const newUser = action.payload || state;
        return { ...newUser, showTour: isLessThanFiveMinOld(newUser) };
      })
      .addCase(enterDemoMode, () => demoUser);
  },
});

export default userSlice.reducer;

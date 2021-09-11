import { createSlice } from '@reduxjs/toolkit';
import { enterDemoMode, fetchUser } from '../actions';
import { blankUser, demoUser } from '../templates';
import { User } from '../types';

export type AuthState = {
  user: User;
  loading: boolean;
  demoMode: boolean;
};

export const initialState: AuthState = {
  user: blankUser,
  loading: true,
  demoMode: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (_state, action) => ({
        user: action.payload || false,
        loading: false,
        demoMode: false,
      }))
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(enterDemoMode, (state) => ({ ...state, loading: false, demoMode: true, user: demoUser }));
  },
});

export default authSlice.reducer;

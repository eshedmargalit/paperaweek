import axios from 'axios';

import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { UserResponse, constructUserFromResponse } from '../dtos';

export const fetchUser = createAsyncThunk('fetchUser', async () => {
  const userResponse = await axios.get<UserResponse>('/api/current_user');
  return constructUserFromResponse(userResponse.data);
});

export const enterDemoMode = createAction('ENTER_DEMO_MODE');

import { Dispatch } from 'redux';
import { FetchUserAction, FETCH_USER, User } from './types';
import axios from 'axios';

export const fetchUser = () => async (dispatch: Dispatch<FetchUserAction>) => {
  let user = await axios.get<User>('/api/current_user');

  if (!user.data) {
    return;
  }
  dispatch({ type: FETCH_USER, payload: user.data });
};

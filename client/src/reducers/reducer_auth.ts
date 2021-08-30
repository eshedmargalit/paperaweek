import { Reducer } from 'redux';
import { ENTER_DEMO_MODE, FETCH_USER, FETCH_USER_FAILED, FETCH_USER_LOADING } from '../actions/actionTypes';
import { AuthReducerAction } from '../actions/types';
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

const reducer: Reducer<AuthState, AuthReducerAction> = (state = initialState, action) => {
  switch (action.type) {
    case ENTER_DEMO_MODE:
      return { ...state, loading: false, demoMode: true, user: demoUser };
    case FETCH_USER_LOADING:
      return { ...state, loading: true };
    case FETCH_USER:
      return { user: action.payload || false, loading: false, demoMode: false }; // "" ==> falsy
    case FETCH_USER_FAILED:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default reducer;

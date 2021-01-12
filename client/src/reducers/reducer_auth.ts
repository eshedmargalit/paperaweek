import { Reducer } from 'redux';
import { FETCH_USER, FETCH_USER_FAILED, FETCH_USER_LOADING } from '../actions/actionTypes';
import { FetchUserAction, FetchUserFailedAction, FetchUserLoadingAction } from '../actions/types';
import { blankUser } from '../templates';
import { User } from '../types';

type AuthState = {
  user: User;
  loading: boolean;
};

export const initialState: AuthState = {
  user: blankUser,
  loading: true,
};

const reducer: Reducer<AuthState, FetchUserAction | FetchUserLoadingAction | FetchUserFailedAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case FETCH_USER_LOADING:
      return { ...state, loading: true };
    case FETCH_USER:
      return { user: action.payload || false, loading: false }; // "" ==> falsy
    case FETCH_USER_FAILED:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default reducer;

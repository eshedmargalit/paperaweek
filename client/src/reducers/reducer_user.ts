import { Reducer } from 'redux';
import { FETCH_USER } from '../actions/actionTypes';
import { FetchUserAction } from '../actions/types';
import { blankUser } from '../templates';
import { User } from '../types';

const initialState: User = blankUser;

const reducer: Reducer<User, FetchUserAction> = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_USER:
      return payload || state;
    default:
      return state;
  }
};

export default reducer;

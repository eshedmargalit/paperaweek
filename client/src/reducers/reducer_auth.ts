import { Reducer } from 'redux';
import { FETCH_USER } from '../actions/actionTypes';
import { FetchUserAction } from '../actions/types';
import { blankUser } from '../templates';
import { User } from '../types';

const initialState: User = blankUser;

const reducer: Reducer<User, FetchUserAction> = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
      return action.payload || false; // "" ==> falsy
    default:
      return state;
  }
};

export default reducer;

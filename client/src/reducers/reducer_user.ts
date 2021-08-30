import { Reducer } from 'redux';
import { ENTER_DEMO_MODE, FETCH_USER } from '../actions/actionTypes';
import { EnterDemoModeAction, FetchUserAction } from '../actions/types';
import { blankUser, demoUser } from '../templates';
import { User } from '../types';

const initialState: User = blankUser;

const reducer: Reducer<User, FetchUserAction | EnterDemoModeAction> = (state = initialState, action) => {
  switch (action.type) {
    case ENTER_DEMO_MODE:
      return demoUser;
    case FETCH_USER:
      return action.payload || state;
    default:
      return state;
  }
};

export default reducer;

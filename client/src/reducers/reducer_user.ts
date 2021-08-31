import { Reducer } from 'redux';
import { ENTER_DEMO_MODE, FETCH_USER } from '../actions/actionTypes';
import { EnterDemoModeAction, FetchUserAction } from '../actions/types';
import { blankUser, demoUser } from '../templates';
import { User } from '../types';

const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutes

function isLessThanFiveMinOld(user: User) {
  const now = new Date();
  const age = now.valueOf() - new Date(user.createdAt).valueOf();
  return age <= FIVE_MINUTES;
}

const initialState: User = blankUser;

const reducer: Reducer<User, FetchUserAction | EnterDemoModeAction> = (state = initialState, action) => {
  switch (action.type) {
    case ENTER_DEMO_MODE:
      return demoUser;
    case FETCH_USER: {
      const newUser = action.payload || state;
      return { ...newUser, showTour: isLessThanFiveMinOld(newUser) };
    }
    default:
      return state;
  }
};

export default reducer;

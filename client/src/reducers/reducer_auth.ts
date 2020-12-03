import { FETCH_USER } from '../actions/actionTypes';
import { FetchUserAction } from '../actions/types';

export default function(state = null, action: FetchUserAction) {
  switch (action.type) {
    case FETCH_USER:
      return action.payload || false; // "" ==> falsy
    default:
      return state;
  }
}

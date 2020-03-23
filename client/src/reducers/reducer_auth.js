import { LOGIN_SUCCESS, LOGIN_FAILURE } from '../actions/index';
const initialState = false;

const reducer = (state = initialState, action) => {
  let { type } = action;
  switch (type) {
    case LOGIN_SUCCESS:
      return true;
    case LOGIN_FAILURE:
      return false;
    default:
      return state;
  }
};

export default reducer;

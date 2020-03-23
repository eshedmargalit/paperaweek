import { LOGIN_SUCCESS } from '../actions/index';
const initialState = {
  displayName: '',
};

const reducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case LOGIN_SUCCESS:
      let { name } = payload;
      return { displayName: name };
    default:
      return state;
  }
};

export default reducer;

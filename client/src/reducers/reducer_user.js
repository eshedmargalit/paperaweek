import { LOGIN_SUCCESS } from '../actions/index';
const initialState = {
  displayName: '',
  userid: '',
};

const reducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case LOGIN_SUCCESS:
      let { name, id } = payload;
      return { userid: id, displayName: name };
    default:
      return state;
  }
};

export default reducer;

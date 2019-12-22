import { UPDATE_READING_LIST } from '../actions/index';
const initialState = [];

const reducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case UPDATE_READING_LIST:
      console.log(payload);
      return payload;
    default:
      return state;
  }
};

export default reducer;

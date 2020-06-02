import { FETCH_USER, GIVE_POINTS } from '../actions/index';
const initialState = {
  points: 0,
};

const reducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case GIVE_POINTS:
      let { newPoints } = payload;
      return { points: newPoints };
    case FETCH_USER:
      if (payload) {
        // maybe just return payload?
        let { points } = payload;
        points = points || 0;
        return { ...state, points };
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default reducer;

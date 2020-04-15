import { FETCH_USER, GIVE_POINTS, HIDE_POINTS_MODAL } from '../actions/index';
const initialState = {
  points: 0,
  increment: 0,
  reason: '',
  displayModal: false,
};

const reducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case GIVE_POINTS:
      let { increment, newPoints, reason } = payload;
      return { points: newPoints, increment: increment, reason: reason, displayModal: true };
    case HIDE_POINTS_MODAL:
      return { ...state, displayModal: false };
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

import { SET_REVIEW } from '../actions/actionTypes';
import { Review } from '../types';
import { blankPaper, blankNotes } from '../templates';
import { SetReviewAction } from '../actions/types';

const initialState: Review = { paper: blankPaper, notes: blankNotes };

const reducer = (state = initialState, action: SetReviewAction) => {
  const { type, payload } = action;
  switch (type) {
    case SET_REVIEW:
      return { ...payload };
    default:
      return state;
  }
};

export default reducer;

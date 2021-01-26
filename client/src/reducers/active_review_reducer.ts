import { Reducer } from 'redux';
import { SET_REVIEW } from '../actions/actionTypes';
import { Review } from '../types';
import { blankPaper, blankNotes } from '../templates';
import { SetReviewAction } from '../actions/types';

const initialState: Review = { paper: blankPaper, notes: blankNotes };

const reducer: Reducer<Review, SetReviewAction> = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_REVIEW:
      return payload;
    default:
      return state;
  }
};

export default reducer;

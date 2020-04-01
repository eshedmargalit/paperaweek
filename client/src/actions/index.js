import axios from 'axios';
export const FETCH_USER = 'FETCH_USER';
export const EXIT_FORM = 'EXIT_FORM';
export const UPDATE_DRAFTS = 'UPDATE_DRAFTS';
export const UPDATE_DRAFT_ID = 'UPDATE_DRAFT_ID';
export const UPDATE_READING_LIST = 'UPDATE_READING_LIST';
export const UPDATE_REVIEWS = 'UPDATE_REVIEWS';
export const START_REVIEW = 'START_REVIEW';
export const END_REVIEW = 'END_REVIEW';

export const fetchUser = () => async dispatch => {
  const user = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: user.data });
};

export function startReview(paperId, reviewContent) {
  return {
    type: START_REVIEW,
    payload: { paperId, reviewContent },
  };
}

export function updateDraftId(draftId) {
  return {
    type: UPDATE_DRAFT_ID,
    payload: { draftId },
  };
}

export function endReview() {
  return {
    type: END_REVIEW,
    payload: null,
  };
}

export function updateReadingList(newReadingList) {
  return {
    type: UPDATE_READING_LIST,
    payload: newReadingList,
  };
}

export function updateDrafts(newDrafts) {
  return {
    type: UPDATE_DRAFTS,
    payload: newDrafts,
  };
}

export function updateReviews(newReviews) {
  return {
    type: UPDATE_REVIEWS,
    payload: newReviews,
  };
}

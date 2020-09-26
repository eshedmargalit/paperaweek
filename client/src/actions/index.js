import axios from 'axios';

export const FETCH_USER = 'FETCH_USER';
export const UPDATE_DRAFTS = 'UPDATE_DRAFTS';
export const UPDATE_DRAFT_ID = 'UPDATE_DRAFT_ID';
export const UPDATE_READING_LIST = 'UPDATE_READING_LIST';
export const UPDATE_REVIEWS = 'UPDATE_REVIEWS';
export const SET_REVIEW = 'SET_REVIEW';

export const fetchUser = () => async dispatch => {
  let user = await axios.get('/api/current_user');

  if (!user.data) {
    return;
  }
  dispatch({ type: FETCH_USER, payload: user.data });
};

export function setReview(paperId, reviewContent) {
  return {
    type: SET_REVIEW,
    payload: { paperId, reviewContent },
  };
}

export function updateDraftId(draftId) {
  return {
    type: UPDATE_DRAFT_ID,
    payload: { draftId },
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

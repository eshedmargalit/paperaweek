export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGIN_PENDING = 'LOGIN_PENDING';
export const EXIT_FORM = 'EXIT_FORM';
export const UPDATE_DRAFTS = 'UPDATE_DRAFTS';
export const UPDATE_DRAFT_ID = 'UPDATE_DRAFT_ID';
export const UPDATE_READING_LIST = 'UPDATE_READING_LIST';
export const UPDATE_REVIEWS = 'UPDATE_REVIEWS';
export const START_REVIEW = 'START_REVIEW';
export const END_REVIEW = 'END_REVIEW';

export function loginSuccess(name) {
  return {
    type: LOGIN_SUCCESS,
    payload: { name },
  };
}

export function loginFailed() {
  return {
    type: LOGIN_FAILURE,
    payload: null,
  };
}

export function loginPending() {
  return {
    type: LOGIN_PENDING,
    payload: null,
  };
}

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

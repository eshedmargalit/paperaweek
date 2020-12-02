export const UPDATE_DRAFTS = 'UPDATE_DRAFTS';
export const UPDATE_DRAFT_ID = 'UPDATE_DRAFT_ID';
export const UPDATE_READING_LIST = 'UPDATE_READING_LIST';
export const UPDATE_REVIEWS = 'UPDATE_REVIEWS';
export const SET_REVIEW = 'SET_REVIEW';

export * from './user';

// @ts-ignore
export function setReview(paperId, reviewContent) {
  return {
    type: SET_REVIEW,
    payload: { paperId, reviewContent },
  };
}

// @ts-ignore
export function updateDraftId(draftId) {
  return {
    type: UPDATE_DRAFT_ID,
    payload: { draftId },
  };
}

// @ts-ignore
export function updateReadingList(newReadingList) {
  return {
    type: UPDATE_READING_LIST,
    payload: newReadingList,
  };
}

// @ts-ignore
export function updateDrafts(newDrafts) {
  return {
    type: UPDATE_DRAFTS,
    payload: newDrafts,
  };
}

// @ts-ignore
export function updateReviews(newReviews) {
  return {
    type: UPDATE_REVIEWS,
    payload: newReviews,
  };
}

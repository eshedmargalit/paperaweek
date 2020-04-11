import axios from 'axios';

import { dailyLoginReason, reviewPointsReason } from './pointReasons.js';
import { sortBy } from 'lodash';
import moment from 'moment';

export const FETCH_USER = 'FETCH_USER';
export const EXIT_FORM = 'EXIT_FORM';
export const UPDATE_DRAFTS = 'UPDATE_DRAFTS';
export const UPDATE_DRAFT_ID = 'UPDATE_DRAFT_ID';
export const UPDATE_READING_LIST = 'UPDATE_READING_LIST';
export const UPDATE_REVIEWS = 'UPDATE_REVIEWS';
export const START_REVIEW = 'START_REVIEW';
export const END_REVIEW = 'END_REVIEW';
export const GIVE_POINTS = 'GIVE_POINTS';
export const HIDE_POINTS_MODAL = 'HIDE_POINTS_MODAL';

export const fetchUser = () => async dispatch => {
  let user = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: user.data });

  // get last login
  const today = new Date();
  const lastLogin = new Date(user.data.lastLogin);
  const lastLoginWasToday = lastLogin.toDateString() === today.toDateString();

  if (!lastLoginWasToday) {
    const pointsToPut = user.data.points + 1;
    const pointsResp = await axios.put(`/api/points/${pointsToPut}`);

    dispatch({
      type: GIVE_POINTS,
      payload: { newPoints: pointsResp.data.points, increment: 1, reason: dailyLoginReason },
    });
  }

  // on successful login, update last login date
  if (user.data) {
    user = await axios.get('/api/lastLogin');
  }
};

export const assignReviewPoints = () => async dispatch => {
  const user = await axios.get('/api/current_user');

  // get most recent review date
  const sorted_reviews = sortBy(user.data.reviews, 'createdAt');
  const last_review_date = sorted_reviews[sorted_reviews.length - 1].createdAt;
  const days_since_last_review = moment().diff(moment(last_review_date), 'days');

  let pointsToGive = 0;
  switch (days_since_last_review) {
    case 6:
    case 7:
    case 8:
      pointsToGive = 6;
      break;
    case 5:
    case 9:
      pointsToGive = 4;
      break;
    case 4:
    case 10:
      pointsToGive = 2;
      break;
    default:
      pointsToGive = 1;
  }

  const pointsToPut = user.data.points + pointsToGive;
  const pointsResp = await axios.put(`/api/points/${pointsToPut}`);

  dispatch({
    type: GIVE_POINTS,
    payload: { newPoints: pointsResp.data.points, increment: pointsToGive, reason: reviewPointsReason },
  });
};

export const hidePointsModal = () => async dispatch => {
  dispatch({ type: HIDE_POINTS_MODAL });
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

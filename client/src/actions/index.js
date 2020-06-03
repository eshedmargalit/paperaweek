import axios from 'axios';

import { dailyLoginReason, reviewPointsReason } from './pointReasons.js';
import PointsModal from '../components/PointsModal/PointsModal';
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

export const fetchUser = () => async dispatch => {
  let user = await axios.get('/api/current_user');
  // let doi_resp = await axios.get('/api/doi/10.1523/JNEUROSCI.2106-19.2020');
  let doi_resp = await axios.get('/api/doi/10.1038/s41583-020-0277-3');
  console.log(doi_resp.data);
  if (!user.data) {
    return;
  }
  dispatch({ type: FETCH_USER, payload: user.data });

  // get last login
  const today = new Date();
  const lastLogin = new Date(user.data.lastLogin);
  const lastLoginWasToday = lastLogin.toDateString() === today.toDateString();

  if (!lastLoginWasToday) {
    const prevPoints = user.data.points || 0;
    const pointsToPut = prevPoints + 1;
    const pointsResp = await axios.put(`/api/points/${pointsToPut}`);

    PointsModal(5, 1, dailyLoginReason);
    dispatch({
      type: GIVE_POINTS,
      payload: { newPoints: pointsResp.data.points },
    });
  }

  // on successful login, update last login date
  if (user.data) {
    user = await axios.get('/api/lastLogin');
  }
};

export const assignReviewPoints = newReviewList => async dispatch => {
  const user = await axios.get('/api/current_user');

  // get most recent review date
  const sortedReviews = sortBy(newReviewList, 'createdAt');
  let daysSinceLastReview = 7;
  let lastReviewDate = null;
  if (sortedReviews.length > 1) {
    lastReviewDate = sortedReviews[sortedReviews.length - 2].createdAt;
    daysSinceLastReview = moment().diff(moment(lastReviewDate), 'days');
  }

  console.log('Most recent review JSON string', JSON.stringify(sortedReviews[sortedReviews.length - 1]));

  let pointsToGive = 0;
  switch (daysSinceLastReview) {
    case 7:
      pointsToGive = 7;
      break;
    case 6:
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
  PointsModal(5, pointsToGive, reviewPointsReason);
  dispatch({
    type: GIVE_POINTS,
    payload: { newPoints: pointsResp.data.points },
  });
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

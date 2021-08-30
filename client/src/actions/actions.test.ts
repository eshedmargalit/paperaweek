/* eslint-disable @typescript-eslint/no-explicit-any */
import { rest } from 'msw';
import { enterDemoMode, fetchUser, setReview, updateDraftId, updateDrafts, updateReadingList, updateReviews } from '.';

import { server } from '../mocks/server';
import { blankPaper, blankReview, blankUser } from '../templates';
import {
  FETCH_USER,
  SET_REVIEW,
  UPDATE_DRAFTS,
  UPDATE_DRAFT_ID,
  UPDATE_READING_LIST,
  UPDATE_REVIEWS,
  ENTER_DEMO_MODE,
} from './actionTypes';

describe('redux actions', () => {
  describe('fetchUser', () => {
    const fetchUserFn = fetchUser();

    it('does not call dispatch if no user is returned', async () => {
      // By default, our mock server returns a user, so we override that behavior for this test
      server.use(rest.get('/api/current_user', (req, res, ctx) => res(ctx.status(200), ctx.body(''))));
      const dispatchMock = jest.fn();

      await fetchUserFn(dispatchMock);
      expect(dispatchMock).not.toHaveBeenCalledWith({ type: FETCH_USER });
    });

    it('calls dispatch if a user is returned', async () => {
      const dispatchMock = jest.fn();

      await fetchUserFn(dispatchMock);
      expect(dispatchMock).toHaveBeenCalledWith({ payload: blankUser, type: FETCH_USER });
    });
  });

  // These are all really simple, but we're chasing that sweet sweet test coverage
  describe('other action creators', () => {
    const scenarios: {
      creator: any;
      arg?: any;
      expectedType: any;
    }[] = [
      { creator: setReview, arg: blankReview, expectedType: SET_REVIEW },
      { creator: updateDraftId, arg: 'Mongo ID', expectedType: UPDATE_DRAFT_ID },
      { creator: updateDrafts, arg: [blankReview], expectedType: UPDATE_DRAFTS },
      { creator: updateReadingList, arg: [blankPaper], expectedType: UPDATE_READING_LIST },
      { creator: updateReviews, arg: [blankReview], expectedType: UPDATE_REVIEWS },
      { creator: enterDemoMode, expectedType: ENTER_DEMO_MODE },
    ];

    scenarios.forEach(({ creator, arg, expectedType }) => {
      it(`returns the right type for ${creator.name}`, () => {
        expect(creator(arg).type).toBe(expectedType);
      });
    });
  });
});

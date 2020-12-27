import { rest } from 'msw';
import { fetchUser } from '.';

import { server } from '../mocks/server';
import { blankUser } from '../templates';
import { FETCH_USER } from './actionTypes';

describe('redux actions', () => {
  describe('fetchUser', () => {
    const fetchUserFn = fetchUser();

    it('does not call dispatch if no user is returned', async () => {
      // By default, our mock server returns a user, so we override that behavior for this test
      server.use(rest.get('/api/current_user', (req, res, ctx) => res(ctx.status(200), ctx.body(''))));
      const dispatchMock = jest.fn();

      await fetchUserFn(dispatchMock);
      expect(dispatchMock).not.toHaveBeenCalled();
    });

    it('calls dispatch if a user is returned', async () => {
      const dispatchMock = jest.fn();

      await fetchUserFn(dispatchMock);
      expect(dispatchMock).toHaveBeenCalledWith({ payload: blankUser, type: FETCH_USER });
    });
  });
});

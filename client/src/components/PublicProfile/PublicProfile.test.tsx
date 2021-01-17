import { createLocation, createMemoryHistory, Location, MemoryHistory } from 'history';
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { match as matchType } from 'react-router-dom';
import { rest } from 'msw';
import PublicProfile from '.';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';
import { Review, User } from '../../types';
import { PublicProfileMatchParams, PublicProfileReduxProps } from './PublicProfile-redux';
import { blankReview, blankUser } from '../../templates';
import { server } from '../../mocks/server';

// Helper to render the profile with any userId and reviewId
// You could, in theory, set all of this up within `renderWithRouterRedux`, but it'd be a massive pain
// and being able to control it all here is pretty convenient
function renderWithMatchOptions(
  userId: User['googleId'] = 'googleId',
  reviewIdToOpen: Review['_id'] = 'reviewId',
  loggedInUser: User = blankUser,
  publicProfile = true
) {
  const match: matchType<PublicProfileMatchParams> = {
    params: { userId, reviewIdToOpen },
    isExact: true,
    path: '',
    url: '',
  };

  const history: MemoryHistory = createMemoryHistory();
  const location: Location = createLocation('/');
  const props: PublicProfileReduxProps = { match, history, location };

  return renderWithRouterRedux(<PublicProfile {...props} />, {
    initialState: { ...getBlankInitialState(), auth: { user: { ...loggedInUser, publicProfile }, loading: false } },
  });
}

describe('<PublicProfile />', () => {
  it('renders without crashing', async () => {
    renderWithMatchOptions();
    await waitFor(() => expect(screen.getByText(/Nobody can see/)).toBeInTheDocument());
  });

  describe('when the profile belongs to the logged-in user', () => {
    describe('when the profile is private', () => {
      it('renders without crashing', async () => {
        const googleId = '12345';
        renderWithMatchOptions(googleId, 'reviewId', { ...blankUser, googleId }, false);
        await waitFor(() => expect(screen.getByText(/Nobody can see/)).toBeInTheDocument());
      });
    });

    describe('when the profile is public', () => {
      const userDisplayName = 'The Notorious 321';
      const googleId = '321';

      beforeEach(() => {
        server.use(
          rest.get(`/api/profiles/${googleId}`, (_req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json({ isOwnPage: true, reviews: [{ ...blankReview, _id: googleId }], userDisplayName })
            );
          })
        );
      });

      it("shows the user's review", async () => {
        renderWithMatchOptions(googleId, 'reviewId', { ...blankUser, googleId }, true);
        await waitFor(() => expect(screen.getByText(`${userDisplayName}'s Reviews`)).toBeInTheDocument());
      });
    });
  });

  describe('when the profile does not belong to the logged-in user', () => {
    describe('when the profile is private', () => {
      const googleId = '456';

      beforeEach(() => {
        server.use(
          rest.get(`/api/profiles/${googleId}`, (_req, res, ctx) => {
            return res(ctx.status(200), ctx.json({ isOwnPage: false }));
          })
        );
      });

      it('shows the 404 page', async () => {
        renderWithMatchOptions(googleId, 'reviewId', { ...blankUser, googleId: `not ${googleId}` }, false);
        await waitFor(() => expect(screen.getByText(/Page not found/)).toBeInTheDocument());
      });
    });

    describe('when the profile is public', () => {
      const googleId = '678';
      const userDisplayName = 'The Notorious 678';

      beforeEach(() => {
        server.use(
          rest.get(`/api/profiles/${googleId}`, (_req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json({ isOwnPage: false, reviews: [{ ...blankReview, _id: 'reviewId' }], userDisplayName })
            );
          })
        );
      });

      it("shows the user's review", async () => {
        renderWithMatchOptions(googleId, 'reviewId', { ...blankUser, googleId: `not ${googleId}` }, false);
        await waitFor(() => expect(screen.getByText(`${userDisplayName}'s Reviews`)).toBeInTheDocument());
      });
    });
  });
});

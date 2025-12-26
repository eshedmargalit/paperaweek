import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PublicProfile from '.';
import { getBlankInitialState } from '../../testUtils/reduxRender';
import { Review, User } from '../../types';
import { blankPaper, blankReview, blankUser } from '../../templates';
import { server } from '../../mocks/server';
import { configureStoreOptions } from '../../store';

// Helper to render the profile with any userId and reviewId
function renderWithMatchOptions(
  userId: User['googleId'] = 'googleId',
  reviewIdToOpen: Review['_id'] = 'reviewId',
  loggedInUser: User = blankUser,
  publicProfile = true
) {
  const initialState = {
    ...getBlankInitialState(),
    auth: { user: { ...loggedInUser, publicProfile }, loading: false, demoMode: false },
  };

  const store = configureStore({
    ...configureStoreOptions,
    preloadedState: initialState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/profiles/${userId}/${reviewIdToOpen}`]}>
        <Routes>
          <Route path="/profiles/:userId/:reviewIdToOpen?" element={<PublicProfile />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
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
              ctx.json({
                isOwnPage: true,
                reviews: [{ ...blankReview, _id: googleId, paper: { ...blankPaper, title: 'Paper Title' } }],
                userDisplayName,
              })
            );
          })
        );
      });

      it("shows the user's review", async () => {
        renderWithMatchOptions(googleId, 'reviewId', { ...blankUser, googleId }, true);
        await waitFor(() => expect(screen.getByText(`${userDisplayName}'s Reviews`)).toBeInTheDocument());
      });

      it('allows copying the link to the reviews', async () => {
        renderWithMatchOptions(googleId, 'reviewId', { ...blankUser, googleId }, true);
        await screen.findByText(`${userDisplayName}'s Reviews`);

        await userEvent.click(screen.getByText('Paper Title'));

        await waitFor(() => expect(screen.getByText('Copy Link')).toBeInTheDocument());
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

      it('shows a privacy explainer page', async () => {
        renderWithMatchOptions(googleId, 'reviewId', { ...blankUser, googleId: `not ${googleId}` }, false);
        await waitFor(() => expect(screen.getByText(/This Profile is Private/)).toBeInTheDocument());
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

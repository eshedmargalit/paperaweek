import { createLocation, createMemoryHistory, Location, MemoryHistory } from 'history';
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { match as matchType } from 'react-router-dom';
import { rest } from 'msw';
import PublicProfile from '.';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';
import { Review, User } from '../../types';
import { PublicProfileMatchParams, PublicProfileReduxProps } from './PublicProfile-redux';
import { blankUser } from '../../templates';
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
        renderWithMatchOptions('12345', 'reviewId', { ...blankUser, googleId: '12345' }, false);
        await waitFor(() => expect(screen.getByText(/Nobody can see/)).toBeInTheDocument());
      });
    });
  });
});

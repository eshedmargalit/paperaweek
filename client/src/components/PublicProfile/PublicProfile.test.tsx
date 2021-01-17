import { createLocation, createMemoryHistory, Location, MemoryHistory } from 'history';
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { match as matchType } from 'react-router-dom';
import PublicProfile from '.';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';
import { Review, User } from '../../types';
import { PublicProfileMatchParams, PublicProfileReduxProps } from './PublicProfile-redux';
import { blankUser } from '../../templates';

// Helper to render the profile with any userId and reviewId
// You could, in theory, set all of this up within `renderWithRouterRedux`, but it'd be a massive pain
// and being able to control it all here is pretty convenient
function renderWithMatchOptions(userId: User['googleId'] = '', reviewIdToOpen: Review['_id'] = '') {
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
    initialState: { ...getBlankInitialState(), auth: { user: blankUser, loading: false } },
  });
}

describe('<PublicProfile />', () => {
  it('renders without crashing', async () => {
    renderWithMatchOptions();
    await waitFor(() => expect(screen.getByText(/Reviews/)).toBeInTheDocument());
  });
});

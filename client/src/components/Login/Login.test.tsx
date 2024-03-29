import { createLocation } from 'history';
import React from 'react';
import { screen } from '@testing-library/react';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';
import Login from './Login';
import { blankUser } from '../../templates';
import { RootState } from '../../store';

describe('<Login />', () => {
  describe('without the user having logged in', () => {
    it('renders the landing page', () => {
      const initialState: RootState = {
        ...getBlankInitialState(),
        auth: { user: blankUser, loading: false, demoMode: false },
      };
      renderWithRouterRedux(<Login location={createLocation('/')} />, { initialState });
      expect(screen.getByText("Read a paper a week. That's it.")).toBeInTheDocument();
    });
  });

  describe('with a logged-in user', () => {
    it('redirects to the dashboard', () => {
      const initialState: RootState = {
        ...getBlankInitialState(),
        auth: { user: { ...blankUser, displayName: 'Piranesi' }, loading: false, demoMode: false },
      };
      renderWithRouterRedux(<Login location={createLocation('/')} />, { redirectTo: '/dashboard', initialState });
      expect(screen.getByText('Redirected to a new page.')).toBeInTheDocument();
    });
  });
});

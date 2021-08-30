import React from 'react';
import { screen } from '@testing-library/react';

import Home from '.';
import { blankUser } from '../../templates';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';
import { RootState } from '../../reducers';

// Helper to quickly render the component with the right Redux initialState
const renderHome = (initialAuthState?: RootState) =>
  renderWithRouterRedux(<Home />, { initialState: initialAuthState });

describe('<Home />', () => {
  describe('with a user logged in', () => {
    const initialAuthState: RootState = {
      ...getBlankInitialState(),
      auth: { user: { ...blankUser, displayName: 'Jim Henderson' }, loading: false, demoMode: false },
    };

    it('renders without crashing', () => {
      renderHome(initialAuthState);
    });

    it('has a search bar', () => {
      renderHome(initialAuthState);
      expect(screen.getAllByPlaceholderText(/search by DOI/)).toBeDefined();
    });

    it('has a reading list', () => {
      renderHome(initialAuthState);
      expect(screen.getByText(/Reading List/)).toBeInTheDocument();
    });

    it('has review list', () => {
      renderHome(initialAuthState);
      expect(screen.getByText(/Read Your Reviews/)).toBeInTheDocument();
    });
  });
});

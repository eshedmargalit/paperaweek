import React from 'react';
import { screen } from '@testing-library/react';

import Home from '.';
import { blankUser } from '../../templates';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';
import { RootState } from '../../reducers';

// Helper to quickly render the component with the right Redux initialState
const renderHome = (initialState?: RootState) => renderWithRouterRedux(<Home />, { initialState });

describe('<Home />', () => {
  describe('with a user logged in', () => {
    const initialState: RootState = { ...getBlankInitialState(), auth: { ...blankUser, displayName: 'Jim Henderson' } };

    it('renders without crashing', () => {
      renderHome(initialState);
    });

    it('has a search bar', () => {
      renderHome(initialState);
      expect(screen.getAllByPlaceholderText(/search by DOI/)).toBeDefined();
    });

    it('has a reading list', () => {
      renderHome(initialState);
      expect(screen.getByText(/Reading List/)).toBeDefined();
    });

    it('has review list', () => {
      renderHome(initialState);
      expect(screen.getByText(/Read Your Reviews/)).toBeDefined();
    });
  });
});

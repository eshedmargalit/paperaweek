import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Home from '.';
import { blankUser, demoUser } from '../../templates';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';
import { RootState } from '../../store';

// Helper to quickly render the component with the right Redux initialState
const renderHome = (initialAuthState?: RootState) =>
  renderWithRouterRedux(<Home />, { initialState: initialAuthState });

describe('<Home />', () => {
  describe('with a user logged in', () => {
    const initialAuthState = {
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
      expect(screen.getAllByText(/Reading List/)).toBeDefined();
    });

    it('has review list', () => {
      renderHome(initialAuthState);
      expect(screen.getByText(/Your Reviews/)).toBeInTheDocument();
    });
  });

  describe('in demo mode', () => {
    const initialAuthState = {
      ...getBlankInitialState(),
      auth: { user: demoUser, loading: false, demoMode: true },
      reviews: { loading: false, reviewList: demoUser.reviews },
      user: { ...demoUser, showTour: true },
    };

    it('shows the tour', () => {
      renderHome(initialAuthState);

      expect(screen.getByText(/all the data you will see on this tour/)).toBeInTheDocument();
    });

    describe('when the user clicks next', () => {
      it('goes to the next step', () => {
        renderHome(initialAuthState);

        expect(screen.getByText(/all the data you will see on this tour/)).toBeInTheDocument();

        const nextButton = screen.getByLabelText('Next');
        userEvent.click(nextButton);

        expect(screen.getByText(/start a review immediately/)).toBeInTheDocument();
      });
    });
  });
});

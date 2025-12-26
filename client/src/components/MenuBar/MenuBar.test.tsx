import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';
import MenuBarRedux from './MenuBar-redux';
import { blankUser } from '../../templates';
import { RootState } from '../../store';

describe('<MenuBar />', () => {
  describe('when logged out', () => {
    it('renders without crashing', () => {
      renderWithRouterRedux(<MenuBarRedux />);
    });

    it('shows the application name', () => {
      renderWithRouterRedux(<MenuBarRedux />);
      expect(screen.getByText(/Paper a Week/)).toBeInTheDocument();
    });

    it('shows the information icon with information on hover', async () => {
      renderWithRouterRedux(<MenuBarRedux />);

      await userEvent.hover(screen.getByLabelText('info-circle'));
      await screen.findByText(/Paper a Week began as an experiment in accountability/);
    });
  });

  describe('when logged in', () => {
    const displayName = 'Piranesi';
    const initialState: RootState = { ...getBlankInitialState(), user: { ...blankUser, displayName } };

    it('renders without crashing', () => {
      renderWithRouterRedux(<MenuBarRedux />, { initialState });
    });

    it("shows the user's name", () => {
      renderWithRouterRedux(<MenuBarRedux />, { initialState });
      expect(screen.getByText(displayName)).toBeInTheDocument();
    });

    it('shows link to profile', async () => {
      renderWithRouterRedux(<MenuBarRedux />, { initialState, redirectTo: '/profiles/' });
      await userEvent.click(screen.getByText('My Profile'));

      await screen.findByText(/Redirect/);
    });
  });
});

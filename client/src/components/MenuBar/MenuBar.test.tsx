import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';
import MenuBarRedux from './MenuBar-redux';
import { blankUser } from '../../templates';

describe('<MenuBar />', () => {
  describe('when logged out', () => {
    it('renders without crashing', () => {
      renderWithRouterRedux(<MenuBarRedux />);
    });

    it('shows the application name', () => {
      renderWithRouterRedux(<MenuBarRedux />);
      expect(screen.getByText(/Paper-A-Week/)).toBeDefined();
    });

    it('shows the information icon with information on hover', async () => {
      renderWithRouterRedux(<MenuBarRedux />);

      userEvent.hover(screen.getByLabelText('info-circle'));
      await waitFor(() =>
        expect(screen.getByText(/Paper-a-Week began as an experiment in accountability/)).toBeDefined()
      );
    });
  });

  describe('when logged in', () => {
    const displayName = 'Piranesi';
    const initialState = { ...getBlankInitialState(), user: { ...blankUser, displayName } };

    it('renders without crashing', () => {
      renderWithRouterRedux(<MenuBarRedux />, { initialState });
    });

    it("shows the user's name", () => {
      renderWithRouterRedux(<MenuBarRedux />, { initialState });
      expect(screen.getByText(displayName)).toBeDefined();
    });

    // TODO EM: I think this should be a <Link /> so that it's easier to test.
    xit('shows link to profile', async () => {
      renderWithRouterRedux(<MenuBarRedux />, { initialState, redirectTo: '/profiles/' });
      userEvent.click(screen.getByText('My Profile'));

      await waitFor(() => expect(screen.getByText(/Redirect/)).toBeDefined());
    });

    // TODO find a sane way to test the hidden menu by mocking `window.matchMedia`
  });
});
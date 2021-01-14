/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewWizard from '.';
import { renderWithRouterRedux, getBlankInitialState } from '../../testUtils/reduxRender';
import { blankReview, blankUser } from '../../templates';

describe('<ReviewWizard />', () => {
  // This is silly, but the react-katex library throws an ugly warning: https://github.com/talyssonoc/react-katex/issues/59
  // so we'll just suppress it :)
  const originalConsoleWarn = console.warn;
  beforeAll(() => (console.warn = jest.fn()));
  afterAll(() => (console.warn = originalConsoleWarn));

  describe('help modal', () => {
    it('opens automatically when no reviews or drafts are present', async () => {
      const initialState = getBlankInitialState();
      renderWithRouterRedux(<ReviewWizard />, { initialState });
      await waitFor(() => expect(screen.getByText(/Try it yourself/)).toBeDefined());
    });

    it('does not open automatically if at least 1 review is present', async () => {
      const initialState = { ...getBlankInitialState(), user: { ...blankUser, reviews: [blankReview] } };
      renderWithRouterRedux(<ReviewWizard />, { initialState });
      await waitFor(() => expect(screen.queryByText(/Try it yourself/)).toBeNull());
    });

    it('does not open automatically if at least 1 draft is present', async () => {
      const initialState = { ...getBlankInitialState(), user: { ...blankUser, drafts: [blankReview] } };
      renderWithRouterRedux(<ReviewWizard />, { initialState });
      await waitFor(() => expect(screen.queryByText(/Try it yourself/)).toBeNull());
    });

    it('opens on click', async () => {
      const initialState = getBlankInitialState();
      renderWithRouterRedux(<ReviewWizard />, { initialState });
      userEvent.click(screen.getByText(/Help/));
      await waitFor(() => expect(screen.getByText(/Try it yourself/)).toBeDefined());
    });
  });
});

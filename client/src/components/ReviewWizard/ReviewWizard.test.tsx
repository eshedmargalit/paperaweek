/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewWizard from '.';
import { renderWithRouterRedux, getBlankInitialState } from '../../testUtils/reduxRender';
import { blankReview, blankUser } from '../../templates';
import { suppressWarnings } from '../../testUtils/suppressWarnings';

describe('<ReviewWizard />', () => {
  suppressWarnings();

  describe('help modal', () => {
    xit('opens automatically when no reviews or drafts are present', async () => {
      const initialState = { ...getBlankInitialState(), auth: { user: blankUser, loading: false } };
      renderWithRouterRedux(<ReviewWizard />, { initialState });
      await waitFor(() => expect(screen.getByText(/Try it yourself/)).toBeInTheDocument());
    });

    it('does not open automatically if at least 1 review is present', async () => {
      const initialState = {
        ...getBlankInitialState(),
        auth: { user: { ...blankUser, reviews: [blankReview] }, loading: false },
      };
      renderWithRouterRedux(<ReviewWizard />, { initialState });
      await waitFor(() => expect(screen.queryByText(/Try it yourself/)).toBeNull());
    });

    it('opens on click', async () => {
      const initialState = getBlankInitialState();
      renderWithRouterRedux(<ReviewWizard />, { initialState });
      userEvent.click(screen.getByText(/Help/));
      await waitFor(() => expect(screen.getByText(/Try it yourself/)).toBeInTheDocument());
    });
  });
});

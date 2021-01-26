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
    it('opens automatically when no reviews or drafts are present', async () => {
      const initialState = {
        ...getBlankInitialState(),
        auth: { user: { ...blankUser, reviews: [] }, loading: false },
      };
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
      renderWithRouterRedux(<ReviewWizard />);
      userEvent.click(screen.getByText(/Help/));
      await waitFor(() => expect(screen.getByText(/Try it yourself/)).toBeInTheDocument());
    });
  });

  describe('form validation', () => {
    it('does not get angry before any fields are touched', () => {
      renderWithRouterRedux(<ReviewWizard />);
      expect(screen.queryByText(/Paper must have a title/)).not.toBeInTheDocument();
    });

    it('gets angry when there is no title', async () => {
      renderWithRouterRedux(<ReviewWizard />);

      const titleInput = screen.getByLabelText('Title');

      //  Start typing, but click away while it's still blank
      userEvent.type(titleInput, '');
      userEvent.click(screen.getByText(/Paper Information/));

      await waitFor(() => expect(screen.getByText(/Paper must have a title/)).toBeInTheDocument());

      // Now make sure it goes away
      userEvent.type(titleInput, 'The Great Burger Article');
      userEvent.click(screen.getByText(/Paper Information/));

      await waitFor(() => expect(screen.queryByText(/Paper must have a title/)).not.toBeInTheDocument());
    });

    it('validates when there are no authors', async () => {
      renderWithRouterRedux(<ReviewWizard />);

      const authorInput = screen.getByLabelText('paper.authors.0');

      //  Start typing, but click away while it's still blank
      userEvent.type(authorInput, '');
      userEvent.click(screen.getByText(/Paper Information/));

      await waitFor(() =>
        expect(screen.getByText(/Paper author must have at least one character/)).toBeInTheDocument()
      );

      // Now make sure it goes away
      userEvent.type(authorInput, 'Don McDon');
      userEvent.click(screen.getByText(/Paper Information/));

      await waitFor(() =>
        expect(screen.queryByText(/Paper author must have at least one character/)).not.toBeInTheDocument()
      );
    });
  });
});

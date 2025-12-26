/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewWizard from '.';
import { renderWithRouterRedux, getBlankInitialState } from '../../testUtils/reduxRender';
import { blankReview, blankUser } from '../../templates';
import { suppressWarnings } from '../../testUtils/suppressWarnings';
import { RootState } from '../../store';

describe('<ReviewWizard />', () => {
  suppressWarnings();

  describe('help modal', () => {
    it('opens automatically when no reviews or drafts are present', async () => {
      const initialState: RootState = {
        ...getBlankInitialState(),
        auth: { user: { ...blankUser, reviews: [] }, loading: false, demoMode: false },
      };
      renderWithRouterRedux(<ReviewWizard />, { initialState });
      await screen.findByText(/Try it yourself/);
    });

    it('does not open automatically if at least 1 review is present', async () => {
      const initialState: RootState = {
        ...getBlankInitialState(),
        auth: { user: { ...blankUser, reviews: [blankReview] }, loading: false, demoMode: false },
      };
      renderWithRouterRedux(<ReviewWizard />, { initialState });
      await waitFor(() => expect(screen.queryByText(/Try it yourself/)).toBeNull());
    });

    it('opens on click', async () => {
      renderWithRouterRedux(<ReviewWizard />);
      await userEvent.click(screen.getByText(/Help/));
      await screen.findByText(/Try it yourself/);
    });
  });

  describe('form validation', () => {
    it('does not get angry before any fields are touched', () => {
      renderWithRouterRedux(<ReviewWizard />);
      expect(screen.queryByText(/Paper must have a title/)).not.toBeInTheDocument();
    });

    it('gets angry when there is no title', async () => {
      renderWithRouterRedux(<ReviewWizard />);

      const titleInput = screen.getByLabelText('Paper Title');

      //  Start typing, but click away while it's still blank
      await userEvent.type(titleInput, '');
      await userEvent.click(screen.getByText(/Paper Information/));

      await screen.findByText(/Paper must have a title/);

      // Now make sure it goes away
      await userEvent.type(titleInput, 'The Great Burger Article');
      await userEvent.click(screen.getByText(/Paper Information/));

      await waitFor(() => expect(screen.queryByText(/Paper must have a title/)).not.toBeInTheDocument());
    });

    it('validates when there are no authors', async () => {
      renderWithRouterRedux(<ReviewWizard />);

      const authorInput = screen.getByLabelText('paper.authors[0]');

      //  Start typing, but click away while it's still blank
      await userEvent.type(authorInput, '');
      await userEvent.click(screen.getByText(/Paper Information/));

      await screen.findByText(/Paper author must have at least one character/);

      // Now make sure it goes away
      await userEvent.type(authorInput, 'Don McDon');
      await userEvent.click(screen.getByText(/Paper Information/));

      await waitFor(() =>
        expect(screen.queryByText(/Paper author must have at least one character/)).not.toBeInTheDocument()
      );
    });
  });

  describe('field-specific tooltips', () => {
    it('shows the right tooltip for the Overview field', async () => {
      renderWithRouterRedux(<ReviewWizard />);
      const tooltips = screen.getAllByLabelText('question-circle');
      await userEvent.hover(tooltips[1]);
      await screen.findByText(/What are the key takeaways/);
    });

    it('shows the right tooltip for the Other field', async () => {
      renderWithRouterRedux(<ReviewWizard />);
      const tooltips = screen.getAllByLabelText('question-circle');
      await userEvent.hover(tooltips[tooltips.length - 1]);
      await screen.findByText(/linking to related papers/);
    });
  });

  describe('in demo mode', () => {
    const initialState: RootState = {
      ...getBlankInitialState(),
      auth: { user: { ...blankUser, reviews: [blankReview] }, loading: false, demoMode: true },
    };
    it('shows the preview modal', () => {
      renderWithRouterRedux(<ReviewWizard />, { initialState });
      expect(screen.getByText(/Login to Continue/)).toBeInTheDocument();
    });
  });
});

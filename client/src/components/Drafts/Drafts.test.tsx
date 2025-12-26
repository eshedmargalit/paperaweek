/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { blankNotes, blankReview } from '../../templates';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';
import DraftsRedux from './Drafts-redux';
import { suppressWarnings } from '../../testUtils/suppressWarnings';
import { RootState } from '../../store';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const initialStateWithDrafts: RootState = {
  ...getBlankInitialState(),
  drafts: [{ ...blankReview, _id: 'id', notes: { ...blankNotes, tldr: 'it was nice' } }],
};

describe('<Drafts />', () => {
  describe('on back', () => {
    it('goes back to the previous page', async () => {
      renderWithRouterRedux(<DraftsRedux />);
      const backButton = screen.getByLabelText('Back');
      await userEvent.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  describe('drafts table', () => {
    suppressWarnings();

    it('renders without crashing', () => {
      renderWithRouterRedux(<DraftsRedux />);
    });

    it('renders the draft information in the table', () => {
      renderWithRouterRedux(<DraftsRedux />, { initialState: initialStateWithDrafts });
      expect(screen.getByText(/it was nice/)).toBeInTheDocument();
    });

    it('displays more options and actions when user clicks on a draft', async () => {
      renderWithRouterRedux(<DraftsRedux />, { initialState: initialStateWithDrafts });
      const draftRow = screen.getByText(/it was nice/);
      await userEvent.click(draftRow);
      await waitFor(() => expect(screen.getByText(/Delete this Draft/)).toBeInTheDocument());
    });

    it('deletes a draft from Redux when the delete button is clicked', async () => {
      renderWithRouterRedux(<DraftsRedux />, { initialState: initialStateWithDrafts });

      // Find the draft's row and click on it.
      await userEvent.click(screen.getByText(/it was nice/));

      // Now that the modal is open, find and click the delete button
      await userEvent.click(await screen.findByText(/Delete this Draft/));

      // Wait for antd to render the confirm modal, then click Yes
      await screen.findByText('Yes');
      await userEvent.click(screen.getByText('Yes'));

      // Wait for the async logic to complete and for the draft to disappear
      await waitFor(() => expect(screen.queryByText(/it was nice/)).toBeNull());
    });

    it('redirects the user to the edit form when the edit button is clicked', async () => {
      renderWithRouterRedux(<DraftsRedux />, { initialState: initialStateWithDrafts, redirectTo: '/form' });

      // Find the draft's row and click on it.
      await userEvent.click(screen.getByText(/it was nice/));

      // Now that the modal is open, find and click the edit button
      await userEvent.click(await screen.findByText(/Edit this Draft/));

      // Confirm that we navigate to the "form" after clicking edit
      await waitFor(() => expect(screen.getByText(/Redirected to a new page/)).toBeInTheDocument());
    });
  });
});

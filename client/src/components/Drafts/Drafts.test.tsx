/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { RootState } from '../../reducers';
import { blankNotes, blankReview } from '../../templates';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';
import DraftsRedux from './Drafts-redux';
import { suppressWarnings } from '../../testUtils/suppressWarnings';

const mockGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(jest.requireActual('react-router-dom') as any),
  useHistory: () => ({
    goBack: mockGoBack,
  }),
}));

const initialStateWithDrafts: RootState = {
  ...getBlankInitialState(),
  drafts: [{ ...blankReview, _id: 'id', notes: { ...blankNotes, tldr: 'it was nice' } }],
};

describe('<Drafts />', () => {
  describe('on back', () => {
    it('goes back to the previous page', () => {
      renderWithRouterRedux(<DraftsRedux />);
      const backButton = screen.getByLabelText('Back');
      userEvent.click(backButton);
      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('drafts table', () => {
    suppressWarnings();

    it('renders without crashing', () => {
      renderWithRouterRedux(<DraftsRedux />);
    });

    it('renders the draft information in the table', () => {
      renderWithRouterRedux(<DraftsRedux />, { initialState: initialStateWithDrafts });
      expect(screen.getByText(/it was nice/)).toBeDefined();
    });

    it('displays more options and actions when user clicks on a draft', () => {
      renderWithRouterRedux(<DraftsRedux />, { initialState: initialStateWithDrafts });
      const draftRow = screen.getByText(/it was nice/);
      userEvent.click(draftRow);
      expect(screen.getByText(/Delete this Draft/)).toBeDefined();
    });

    it('deletes a draft from Redux when the delete button is clicked', async () => {
      renderWithRouterRedux(<DraftsRedux />, { initialState: initialStateWithDrafts });

      // Find the draft's row and click on it.
      userEvent.click(screen.getByText(/it was nice/));

      // Now that the modal is open, find and click the delete button
      userEvent.click(screen.getByText(/Delete this Draft/));

      // Wait for antd to render the confirm modal, then click Yes
      await waitFor(() => screen.getByText('Yes'));
      userEvent.click(screen.getByText('Yes'));

      // Wait for the async logic to complete and for the draft to disappear
      await waitFor(() => expect(screen.queryByText(/it was nice/)).toBeNull());
    });

    it('redirects the user to the edit form when the edit button is clicked', async () => {
      renderWithRouterRedux(<DraftsRedux />, { initialState: initialStateWithDrafts, redirectTo: '/form' });

      // Find the draft's row and click on it.
      userEvent.click(screen.getByText(/it was nice/));

      // Now that the modal is open, find and click the edit button
      userEvent.click(screen.getByText(/Edit this Draft/));

      // Confirm that we navigate to the "form" after clicking edit
      expect(screen.getByText(/Redirected to a new page/)).toBeDefined();
    });
  });
});

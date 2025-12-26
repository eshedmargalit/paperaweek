import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { blankPaper } from '../../templates';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';
import { RootState } from '../../store';
import { ReadingListState } from '../../slices/readingListSlice';
import ReadingList from '.';

describe('<ReadingList />', () => {
  const readingList: ReadingListState = [];
  const initialState: RootState = { ...getBlankInitialState(), readingList };

  it('shows the option to add a manual entry', () => {
    renderWithRouterRedux(<ReadingList />, { initialState });
    expect(screen.getByText(/Add to Reading List/)).toBeInTheDocument();
  });

  describe('when the user clicks the manual add button', () => {
    const setupManualAdd = async () => {
      renderWithRouterRedux(<ReadingList />, { initialState });
      const startButton = screen.getByRole('button');
      await userEvent.click(startButton);

      // wait for Input to appear
      await screen.findByPlaceholderText('Paper title');

      // type in a title
      await userEvent.type(screen.getByPlaceholderText('Paper title'), 'Everything about giraffes');
    };

    it('allows papers to be added', async () => {
      await setupManualAdd();

      // click the accept button
      const acceptButton = screen.getByRole('button', { name: 'submit' });
      await userEvent.click(acceptButton);

      // see that our paper made it in
      await screen.findByText(/giraffes/);
    });

    it('allows you to bail out', async () => {
      await setupManualAdd();

      // click the cancel button
      const cancelButton = screen.getByRole('button', { name: 'cancel' });
      await userEvent.click(cancelButton);

      // see that our paper did not make it in
      await waitFor(() => expect(screen.queryByText(/giraffes/)).not.toBeInTheDocument());
    });
  });

  describe('when there are no papers in the reading list', () => {
    it('prompts the user to add some', () => {
      renderWithRouterRedux(<ReadingList />, { initialState });
      expect(screen.getByText(/Add papers to your reading list/)).toBeInTheDocument();
    });
  });

  describe('when there is a paper in the reading list', () => {
    describe('and the authors are listed', () => {
      const testReadingList: ReadingListState = [
        {
          ...blankPaper,
          title:
            'The wonderful world of potatoes, their colors, their feelings, and how to approach discussions of starchiness',
          authors: ['Geoff Taylor', 'Marisa Nuzzi'],
        },
      ];
      const testInitialState: RootState = { ...getBlankInitialState(), readingList: testReadingList };
      it('displays the start of the paper title', () => {
        renderWithRouterRedux(<ReadingList />, { initialState: testInitialState });
        expect(screen.getByText(/The wonderful world/)).toBeInTheDocument();
      });

      it('does not display the end of the paper title', () => {
        renderWithRouterRedux(<ReadingList />, { initialState: testInitialState });
        expect(screen.queryByText(/starchiness/)).not.toBeInTheDocument();
      });

      it('shows author last names', () => {
        renderWithRouterRedux(<ReadingList />, { initialState: testInitialState });
        expect(screen.getByText(/Taylor/)).toBeInTheDocument();
        expect(screen.queryByText(/Geoff/)).not.toBeInTheDocument();
      });
    });

    describe('and there are no authors', () => {
      const testReadingList2: ReadingListState = [
        {
          ...blankPaper,
          title:
            'The wonderful world of potatoes, their colors, their feelings, and how to approach discussions of starchiness',
          authors: [],
        },
      ];
      const testInitialState2: RootState = { ...getBlankInitialState(), readingList: testReadingList2 };
      it('says N/A', () => {
        renderWithRouterRedux(<ReadingList />, { initialState: testInitialState2 });
        expect(screen.getByText(/N\/A/)).toBeInTheDocument();
      });
    });
  });

  describe('when there are no papers in the reading list', () => {
    const emptyReadingList: ReadingListState = [];
    const emptyInitialState: RootState = { ...getBlankInitialState(), readingList: emptyReadingList };

    it('prompts the user to add some', () => {
      renderWithRouterRedux(<ReadingList />, { initialState: emptyInitialState });
      expect(screen.getByText(/Add papers to your reading list/)).toBeInTheDocument();
    });
  });
});

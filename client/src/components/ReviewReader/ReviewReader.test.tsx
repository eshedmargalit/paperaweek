import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewReader from '.';
import { renderWithRouterRedux, getBlankInitialState } from '../../testUtils/reduxRender';
import { blankPaper, blankReview } from '../../templates';
import { LoadingReviewList } from '../../reducers/reducer_reviews';

describe('<ReviewReader />', () => {
  const reviews: LoadingReviewList = {
    loading: false,
    reviewList: [
      {
        ...blankReview,
        _id: '1',
        paper: { ...blankPaper, title: 'Everything About Potatoes', authors: ['Eshed Margalit', 'Arad Margalit'] },
      },
      { ...blankReview, _id: '2', paper: { ...blankPaper, title: 'I Scream for Ice Cream' } },
    ],
  };
  const initialState = { ...getBlankInitialState(), reviews };

  describe('header', () => {
    it('renders without crashing', () => {
      renderWithRouterRedux(<ReviewReader />, { initialState });
      expect(screen.getByText(/Read Your Reviews/)).toBeInTheDocument();
    });
  });

  describe('search input', () => {
    it('shows the right placeholder', () => {
      renderWithRouterRedux(<ReviewReader />, { initialState });
      expect(screen.getByPlaceholderText(/Filter by/)).toBeInTheDocument();
    });

    describe('when search bar is empty', () => {
      it('displays both the potato paper and the ice cream paper', async () => {
        renderWithRouterRedux(<ReviewReader />, { initialState });

        expect(screen.getByText(/Everything About Potatoes/)).toBeInTheDocument();
        expect(screen.getByText(/Ice Cream/)).toBeInTheDocument();
      });
    });

    describe('when user searches for potatoes', () => {
      it('displays the potato paper and not the ice cream paper', async () => {
        renderWithRouterRedux(<ReviewReader />, { initialState });

        // Type in a search query
        const searchInput = screen.getByPlaceholderText(/Filter by/);
        userEvent.type(searchInput, 'potatoes');

        await waitFor(() => expect(screen.getByText(/Everything About Potatoes/)).toBeInTheDocument());
        await waitFor(() => expect(screen.queryByText(/Ice Cream/)).not.toBeInTheDocument());
      });
    });

    describe('when user searches for ice cream', () => {
      it('displays the ice cream paper, but no dirty spuds', async () => {
        renderWithRouterRedux(<ReviewReader />, { initialState });

        // Type in a search query
        const searchInput = screen.getByPlaceholderText(/Filter by/);
        userEvent.type(searchInput, 'ice cream');

        await waitFor(() => expect(screen.getByText(/Ice Cream/)).toBeInTheDocument());
        await waitFor(() => expect(screen.queryByText(/Everything/)).not.toBeInTheDocument());
      });
    });

    describe('review modal', () => {
      describe('when the potato paper is being read', () => {
        it('shows the title and authors', () => {
          renderWithRouterRedux(<ReviewReader />, { initialState });

          // first element is the table entry, second is the hidden modal
          const potatoPaper = screen.getAllByText(/Everything About Potatoes/)[0];
          userEvent.click(potatoPaper);

          expect(screen.getByText(/Eshed Margalit/)).toBeInTheDocument();
        });
        it('has no TLDR', () => {
          renderWithRouterRedux(<ReviewReader />, { initialState });

          // first element is the table entry, second is the hidden modal
          const potatoPaper = screen.getAllByText(/Everything About Potatoes/)[0];
          userEvent.click(potatoPaper);

          expect(screen.queryByText(/TLDR/)).not.toBeInTheDocument();
        });
      });
    });
  });
});

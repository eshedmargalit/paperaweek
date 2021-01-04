import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaperSearchBar from '.';
import { renderWithRouterRedux } from '../../testUtils/reduxRender';

describe('<PaperSearchBar />', () => {
  describe('header', () => {
    it('provides usage instructions', () => {
      renderWithRouterRedux(<PaperSearchBar />);
      expect(screen.getByText(/Write a Review/)).toBeDefined();
      expect(screen.getByText(/Search online for papers/)).toBeDefined();
    });
  });

  describe('search input', () => {
    it('shows the right placeholder', () => {
      renderWithRouterRedux(<PaperSearchBar />);
      expect(screen.getByPlaceholderText(/search by DOI, title, author, or journal/)).toBeDefined();
    });

    describe('when search is not a doi', () => {
      it('renders relevant papers', async () => {
        renderWithRouterRedux(<PaperSearchBar />);

        // Type in a search query
        const searchInput = screen.getByPlaceholderText(/search by/);
        userEvent.type(searchInput, 'search query');

        // To account for debounce, wait for loading spinner
        await waitFor(() => screen.getByTestId('paper-searchbar-spinner'));

        // Once the result comes back from our mocked API, confirm they're rendered
        // This mock data we're expecting is defined in handlers.ts
        await waitFor(() => expect(screen.getByText('Test Interpret Title')).toBeDefined());
      });
    });

    describe('when search is a doi', () => {
      it('renders relevant papers', async () => {
        renderWithRouterRedux(<PaperSearchBar />);

        // Type in a search query
        const searchInput = screen.getByPlaceholderText(/search by/);
        userEvent.type(searchInput, 'http://dx.doi.org/10.1523/JNEUROSCI.2106-19');

        // To account for debounce, wait for loading spinner
        await waitFor(() => screen.getByTestId('paper-searchbar-spinner'));

        // Once the result comes back from our mocked API, confirm they're rendered
        // This mock data we're expecting is defined in handlers.ts
        await waitFor(() => expect(screen.getByText('Test DOI Title')).toBeDefined());
      });
    });
  });
});

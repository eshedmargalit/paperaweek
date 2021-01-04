import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import PaperSearchBar from '.';
import { renderWithRouterRedux } from '../../testUtils/reduxRender';
import { server } from '../../mocks/server';

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

  describe('manual entry buttons', () => {
    it('the first one redirects to the form page', () => {
      renderWithRouterRedux(<PaperSearchBar />, { redirectTo: '/form' });
      userEvent.click(screen.getAllByText(/Create Manual Entry/)[0]);
      expect(screen.getByText(/Redirected to a new page/)).toBeDefined();
    });

    it('the second one redirects to the form page', () => {
      renderWithRouterRedux(<PaperSearchBar />, { redirectTo: '/form' });
      userEvent.click(screen.getAllByText(/Create Manual Entry/)[1]);
      expect(screen.getByText(/Redirected to a new page/)).toBeDefined();
    });
  });

  describe('results', () => {
    it('shows not found if none are found', async () => {
      // For this test, we want no papers to be returned, so override the mock server handler
      server.use(rest.get('/api/searchBar/interpret/notFound', (_req, res, ctx) => res(ctx.status(200), ctx.json([]))));

      renderWithRouterRedux(<PaperSearchBar />);

      // Type in a search query
      const searchInput = screen.getByPlaceholderText(/search by/);
      userEvent.type(searchInput, 'notFound');

      // Once no result comes back from our mocked API, confirm our custom message is rendered
      await waitFor(() => expect(screen.getByText('No Results Found')).toBeDefined());
    });
  });
});

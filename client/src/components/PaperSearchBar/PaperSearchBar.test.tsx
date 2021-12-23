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
      expect(screen.getByText(/Write a Review/)).toBeInTheDocument();
    });
  });

  describe('search input', () => {
    it('shows the right placeholder', () => {
      renderWithRouterRedux(<PaperSearchBar />);
      expect(screen.getByPlaceholderText(/search by DOI/)).toBeInTheDocument();
    });

    describe('when search is not a doi', () => {
      it('shows no results, because the search API is deprecated', async () => {
        renderWithRouterRedux(<PaperSearchBar />);

        // Type in a search query
        const searchInput = screen.getByPlaceholderText(/search by/);
        userEvent.type(searchInput, 'search query');

        // To account for debounce, wait for loading spinner
        await screen.findByTestId('paper-searchbar-spinner');

        // Once the result comes back from our mocked API, confirm they're rendered
        // This mock data we're expecting is defined in handlers.ts
        await waitFor(() => expect(screen.getByText('No Results Found')).toBeInTheDocument());
      });
    });

    describe('when search is a doi', () => {
      it('renders relevant papers', async () => {
        renderWithRouterRedux(<PaperSearchBar />);

        // Type in a search query
        const searchInput = screen.getByPlaceholderText(/search by/);
        userEvent.type(searchInput, 'http://dx.doi.org/10.1523/JNEUROSCI.2106-19');

        // To account for debounce, wait for loading spinner
        await screen.findByTestId('paper-searchbar-spinner');

        // Once the result comes back from our mocked API, confirm they're rendered
        // This mock data we're expecting is defined in handlers.ts
        await waitFor(() => expect(screen.getByText('Test DOI Title')).toBeInTheDocument());
      });
    });
  });

  describe('manual entry button', () => {
    it('redirects to the form page', () => {
      renderWithRouterRedux(<PaperSearchBar />, { redirectTo: '/form' });
      userEvent.click(screen.getByText(/Create Manual Entry/));
      expect(screen.getByText(/Redirected to a new page/)).toBeInTheDocument();
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
      await waitFor(() => expect(screen.getByText('No Results Found')).toBeInTheDocument());
    });

    describe('result interaction', () => {
      it('shows both options on click', async () => {
        // Render some basic results
        renderWithRouterRedux(<PaperSearchBar />);

        // Type in a search query
        const searchInput = screen.getByPlaceholderText(/search by/);
        userEvent.type(searchInput, 'http://dx.doi.org/10.1523/JNEUROSCI.2106-19');
        await screen.findByText('Test DOI Title');

        // Click on the item
        userEvent.click(screen.getByText('Test DOI Title'));

        // Confirm both popover options are present
        expect(screen.getByText(/Add to Reading List/)).toBeInTheDocument();
        expect(screen.getByText(/Start Review Now/)).toBeInTheDocument();
      });

      it('adds results to the reading list', async () => {
        // Render some basic results
        renderWithRouterRedux(<PaperSearchBar />);

        // Type in a search query
        const searchInput = screen.getByPlaceholderText(/search by/);
        userEvent.type(searchInput, 'http://dx.doi.org/10.1523/JNEUROSCI.2106-19');
        await screen.findByText('Test DOI Title');

        // Click on the item
        userEvent.click(screen.getByText('Test DOI Title'));
        userEvent.click(screen.getByText(/Add to Reading List/));
      });

      it('starts the review now', async () => {
        // Render some basic results
        renderWithRouterRedux(<PaperSearchBar />, { redirectTo: '/form' });

        // Type in a search query
        const searchInput = screen.getByPlaceholderText(/search by/);
        userEvent.type(searchInput, 'http://dx.doi.org/10.1523/JNEUROSCI.2106-19');
        await screen.findByText('Test DOI Title');

        // Click on the item
        userEvent.click(screen.getByText('Test DOI Title'));
        userEvent.click(screen.getByText(/Start Review Now/));

        expect(screen.getByText(/Redirected/)).toBeInTheDocument();
      });
    });
  });
});

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
      expect(screen.getByPlaceholderText(/search by title, DOI, or author/)).toBeInTheDocument();
    });

    describe('when user searches for a paper', () => {
      it('renders relevant papers', async () => {
        renderWithRouterRedux(<PaperSearchBar />);

        // Type in a search query
        const searchInput = screen.getByPlaceholderText(/search by/);
        userEvent.type(searchInput, 'all about aardvarks');

        // To account for debounce, wait for loading spinner
        await screen.findByTestId('paper-searchbar-spinner');

        // Once the result comes back from our mocked API, confirm they're rendered
        // This mock data we're expecting is defined in handlers.ts
        await waitFor(() => expect(screen.getByText('Test Paper Title')).toBeInTheDocument());
      });
    });
  });

  describe('manual entry button', () => {
    it('redirects to the form page', async () => {
      renderWithRouterRedux(<PaperSearchBar />, { redirectTo: '/form' });
      await userEvent.click(screen.getByText(/Create Manual Entry/));
      expect(screen.getByText(/Redirected to a new page/)).toBeInTheDocument();
    });
  });

  describe('results', () => {
    it('shows not found if none are found', async () => {
      // For this test, we want no papers to be returned, so override the mock server handler
      server.use(rest.get('/api/search/notFound', (_req, res, ctx) => res(ctx.status(200), ctx.json([]))));

      renderWithRouterRedux(<PaperSearchBar />);

      // Type in a search query
      const searchInput = screen.getByPlaceholderText(/search by/);
      await userEvent.type(searchInput, 'notFound');

      // Once no result comes back from our mocked API, confirm our custom message is rendered
      await waitFor(() => expect(screen.getByText('No Results Found')).toBeInTheDocument());
    });

    describe('result interaction', () => {
      it('shows both options on click', async () => {
        // Render some basic results
        renderWithRouterRedux(<PaperSearchBar />);

        // Type in a search query
        const searchInput = screen.getByPlaceholderText(/search by/);
        await userEvent.type(searchInput, 'all about aardvarks');
        await screen.findByText('Test Paper Title');

        // Click on the item
        await userEvent.click(screen.getByText('Test Paper Title'));

        // Confirm both popover options are present
        await waitFor(() => expect(screen.getByText(/Add to Reading List/)).toBeInTheDocument());
        expect(screen.getByText(/Start Review Now/)).toBeInTheDocument();
      });

      it('adds results to the reading list', async () => {
        // Render some basic results
        renderWithRouterRedux(<PaperSearchBar />);

        // Type in a search query
        const searchInput = screen.getByPlaceholderText(/search by/);
        await userEvent.type(searchInput, 'aardvark sleeping habits');
        await screen.findByText('Test Paper Title');

        // Click on the item
        await userEvent.click(screen.getByText('Test Paper Title'));
        await userEvent.click(screen.getByText(/Add to Reading List/));
      });

      it('starts the review now', async () => {
        // Render some basic results
        renderWithRouterRedux(<PaperSearchBar />, { redirectTo: '/form' });

        // Type in a search query
        const searchInput = screen.getByPlaceholderText(/search by/);
        await userEvent.type(searchInput, 'aardvark obsession');
        await screen.findByText('Test Paper Title');

        // Click on the item
        await userEvent.click(screen.getByText('Test Paper Title'));
        await userEvent.click(screen.getByText(/Start Review Now/));

        await waitFor(() => expect(screen.getByText(/Redirected/)).toBeInTheDocument());
      });
    });
  });
});

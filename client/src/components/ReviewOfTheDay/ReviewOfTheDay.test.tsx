import React from 'react';
import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { useMedia } from 'react-media';
import ReviewOfTheDay from '.';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';
import { Review } from '../../types';
import { blankReview } from '../../templates';

vi.mock('react-media', () => ({
  useMedia: vi.fn().mockReturnValue(false),
}));

const mockedReactMedia = vi.mocked(useMedia);

function makeReview(monthsAgo: number): Review {
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - monthsAgo * 30);

  return {
    ...blankReview,
    createdAt,
  };
}

function renderWithReviews(numReviews = 5) {
  const reviewList: Review[] = [];
  for (let i = 0; i < numReviews; i++) {
    reviewList.push(makeReview(i));
  }

  renderWithRouterRedux(<ReviewOfTheDay />, {
    initialState: { ...getBlankInitialState(), reviews: { loading: false, reviewList } },
  });
}

describe('Review of the Day', () => {
  it('renders absolutely nothing if the user has fewer than 5 reviews', () => {
    renderWithReviews(0);
    expect(screen.queryByText('Review Revisit Rewind')).not.toBeInTheDocument();
  });

  describe('subtitle', () => {
    it('hides the subtitle when the screen size is too small', () => {
      mockedReactMedia.mockReturnValue(true);
      renderWithReviews();

      expect(screen.queryByText(/weeks ago/)).not.toBeInTheDocument();
    });

    it('shows the subtitle when the screen size is big enough', () => {
      mockedReactMedia.mockReturnValue(false);
      renderWithReviews();

      expect(screen.getByText(/weeks ago/)).toBeInTheDocument();
    });
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';
import moment from 'moment';
import FrequencyChart from '.';
import { blankReview } from '../../templates';
import { Review } from '../../types';

describe('<FrequencyChart />', () => {
  describe('without any reviews', () => {
    it('politely refuses to render', () => {
      render(<FrequencyChart reviews={[]} />);
      expect(screen.getByText(/Not Enough Reviews/)).toBeInTheDocument();
    });
  });

  describe('with fewer than three reviews', () => {
    const reviews: Review[] = [
      {
        ...blankReview,
        createdAt: moment()
          .subtract('1', 'weeks')
          .toDate(),
      },
      {
        ...blankReview,
        createdAt: moment()
          .subtract('2', 'weeks')
          .toDate(),
      },
    ];
    it('politely refuses to render', () => {
      render(<FrequencyChart reviews={reviews} />);
      expect(screen.getByText(/Not Enough Reviews/)).toBeInTheDocument();
    });
  });

  describe('with many reviews over the past few weeks', () => {
    const reviews: Review[] = [
      {
        ...blankReview,
        createdAt: moment()
          .subtract('1', 'weeks')
          .toDate(),
      },
      {
        ...blankReview,
        createdAt: moment()
          .subtract('2', 'weeks')
          .toDate(),
      },
      {
        ...blankReview,
        createdAt: moment()
          .subtract('3', 'weeks')
          .toDate(),
      },
      {
        ...blankReview,
        createdAt: moment()
          .subtract('4', 'weeks')
          .toDate(),
      },
    ];

    it('renders 4 written', () => {
      render(<FrequencyChart reviews={reviews} />);
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('renders about 1 per week', () => {
      render(<FrequencyChart reviews={reviews} />);
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('with many reviews written more than 6 months ago', () => {
    const reviews: Review[] = [
      {
        ...blankReview,
        createdAt: moment()
          .subtract('30', 'weeks')
          .toDate(),
      },
      {
        ...blankReview,
        createdAt: moment()
          .subtract('31', 'weeks')
          .toDate(),
      },
      {
        ...blankReview,
        createdAt: moment()
          .subtract('32', 'weeks')
          .toDate(),
      },
    ];

    describe('by default', () => {
      it('declines to render b/c not enough reviews within 6 months', () => {
        render(<FrequencyChart reviews={reviews} />);
        expect(screen.getByText(/Not Enough Reviews/)).toBeInTheDocument();
      });
    });

    describe('when Past Year is selected', () => {
      it('renders those old reviews', async () => {
        render(<FrequencyChart reviews={reviews} />);
        const dropdown = screen.getByRole('button');
        userEvent.hover(dropdown);
        await waitFor(() => screen.getByText('Last Year'));
        userEvent.click(screen.getByText('Last Year'));
        expect(screen.getByText(/written/)).toBeInTheDocument();
      });
    });
  });
});

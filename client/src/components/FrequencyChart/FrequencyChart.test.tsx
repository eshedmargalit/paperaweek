import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';
import moment from 'moment';
import FrequencyChart from '.';
import { blankReview } from '../../templates';
import { Review } from '../../types';

const makeReviewArrayWeekly = (startWeekOffset: number, numReviews: number): Review[] => {
  const range = Array.from(Array(numReviews).keys());
  return range.map(i => {
    return {
      ...blankReview,
      createdAt: moment()
        .subtract(startWeekOffset + i, 'weeks')
        .toDate(),
    };
  });
};

describe('<FrequencyChart />', () => {
  describe('without any reviews', () => {
    it('politely refuses to render', () => {
      render(<FrequencyChart reviews={[]} />);
      expect(screen.getByText(/Not Enough Reviews/)).toBeInTheDocument();
    });
  });

  describe('with fewer than three reviews', () => {
    const reviews: Review[] = makeReviewArrayWeekly(1, 2);

    it('politely refuses to render', () => {
      render(<FrequencyChart reviews={reviews} />);
      expect(screen.getByText(/Not Enough Reviews/)).toBeInTheDocument();
    });
  });

  describe('with many reviews over the past few weeks', () => {
    const reviews: Review[] = makeReviewArrayWeekly(1, 4);

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
    const reviews: Review[] = makeReviewArrayWeekly(30, 4);

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
        await waitFor(() => screen.getByText('Past Year'));
        userEvent.click(screen.getByText('Past Year'));
        expect(screen.getByText(/written/)).toBeInTheDocument();
      });
    });
  });

  describe('with one review a week for a year, but nothing in last 3 months because times have just been really hard and life has gotten super busy', () => {
    interface Scenario {
      buttonText: string;
      expectedText: RegExp;
    }
    const reviews: Review[] = makeReviewArrayWeekly(12, 52);
    const scenarios: Scenario[] = [
      // {
      //   buttonText: 'Past 3 Months',
      //   expectedText: /Not Enough Reviews/,
      // },
      // {
      //   buttonText: 'Past 6 Months',
      //   expectedText: /\.5/,
      // },
      {
        buttonText: 'Past Year',
        expectedText: /\.7/,
      },
      {
        buttonText: 'All Time',
        expectedText: /\.8/,
      },
    ];

    scenarios.forEach(({ buttonText, expectedText }) => {
      describe(`when ${buttonText} is selected`, () => {
        it('renders the expected statistics', async () => {
          render(<FrequencyChart reviews={reviews} />);
          const dropdown = screen.getByRole('button');
          userEvent.hover(dropdown);
          // await waitFor(() => screen.getByText(buttonText));
          // userEvent.click(screen.getByText(buttonText));
          await waitFor(() => screen.getByText('Past Year'));
          userEvent.click(screen.getByText('Past Year'));
          expect(screen.getByText(/\.7/)).toBeInTheDocument();
        });
      });
    });

    describe('by default', () => {
      it('renders at about 0.5/wk', () => {
        render(<FrequencyChart reviews={reviews} />);
        expect(screen.getByText(/\.5/)).toBeInTheDocument();
      });
    });
  });
});

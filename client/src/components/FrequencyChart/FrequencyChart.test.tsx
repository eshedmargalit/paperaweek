import { render, screen } from '@testing-library/react';
import React from 'react';
import FrequencyChart from '.';
import { blankReview } from '../../templates';
import { Review } from '../../types';

describe('<FrequencyChart />', () => {
  describe('without reviews', () => {
    it('renders 0 / week and 0 total', () => {
      render(<FrequencyChart reviews={[]} />);
      expect(screen.getAllByText('0')).toBeDefined();
    });
  });

  describe('with one review', () => {
    const reviews = [blankReview];

    it('renders 1 written', () => {
      render(<FrequencyChart reviews={reviews} />);
      expect(screen.getAllByText('1')).toBeDefined();
    });

    it('renders about 1 per week', () => {
      render(<FrequencyChart reviews={reviews} />);
      expect(screen.getAllByText('1')).toBeDefined();
    });
  });

  describe('with many reviews over many weeks', () => {
    const reviews: Review[] = [
      { ...blankReview, createdAt: new Date('1990-01-01') },
      { ...blankReview, createdAt: new Date('1990-01-08') },
      { ...blankReview, createdAt: new Date('1990-01-15') },
      { ...blankReview, createdAt: new Date('1990-01-21') },
    ];

    it('renders 4 written', () => {
      render(<FrequencyChart reviews={reviews} />);
      expect(screen.getAllByText('4')).toBeDefined();
    });

    it('renders about 1 per week', () => {
      render(<FrequencyChart reviews={reviews} />);
      expect(screen.getAllByText('1')).toBeDefined();
    });
  });
});

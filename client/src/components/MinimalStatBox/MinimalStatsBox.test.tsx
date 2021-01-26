import { render, screen } from '@testing-library/react';
import React from 'react';
import { blankReview } from '../../templates';
import MinimalStatBoxView, { MinimalStatBoxViewProps } from './MinimalStatBox-view';

const defaultProps: MinimalStatBoxViewProps = {
  reviews: [],
};

const renderStatBoxView = (props?: Partial<MinimalStatBoxViewProps>) => {
  return render(<MinimalStatBoxView {...defaultProps} {...props} />);
};

describe('<MinimalStatBox />', () => {
  describe('with no reviews', () => {
    it('renders without crashing', () => {
      renderStatBoxView();
    });

    it('tells the user to get some writing in!', () => {
      renderStatBoxView();
      expect(screen.getByText(/Stats will begin to appear/)).toBeInTheDocument();
    });
  });

  describe('with fewer than 3 reviews', () => {
    const props: MinimalStatBoxViewProps = {
      reviews: [blankReview, blankReview],
    };

    it('renders without crashing', () => {
      renderStatBoxView(props);
    });

    it('tells the user how many are left', () => {
      renderStatBoxView(props);
      expect(screen.getByText(/1/)).toBeInTheDocument();
    });
  });

  describe('with 3 or more', () => {
    const props: MinimalStatBoxViewProps = {
      reviews: [blankReview, blankReview, blankReview],
    };

    it('renders without crashing', () => {
      renderStatBoxView(props);
    });

    it('shows the statistics panel', () => {
      renderStatBoxView(props);
      expect(screen.getByText(/Papers per Week/)).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { screen } from '@testing-library/react';
import moment from 'moment';
import StatBox from '.';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';
import { blankReview, blankUser } from '../../templates';
import { Review } from '../../types';

describe('<StatBox />', () => {
  it('renders without crashing', () => {
    renderWithRouterRedux(<StatBox />);
  });

  it('indicates to the user that stats should go here', () => {
    renderWithRouterRedux(<StatBox />);
    expect(screen.getByText(/Your Stats/)).toBeInTheDocument();
  });

  describe('when the user has fewer than 3 reviews', () => {
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
    const initialState = { ...getBlankInitialState(), user: { ...blankUser, reviews } };

    it('tells them stats will appear soon', () => {
      renderWithRouterRedux(<StatBox />, { initialState });
      expect(screen.getByText(/Stats will begin to appear/)).toBeInTheDocument();
    });
  });

  describe('when the user has 3+ reviews', () => {
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
    const initialState = { ...getBlankInitialState(), user: { ...blankUser, reviews } };

    it('shows the line chart', () => {
      renderWithRouterRedux(<StatBox />, { initialState });
      expect(screen.getByText(/written/)).toBeInTheDocument();
    });
  });
});

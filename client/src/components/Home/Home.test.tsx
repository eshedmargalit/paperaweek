import React from 'react';
import { screen } from '@testing-library/react';

import Home from '.';
import { blankUser } from '../../templates';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';

describe('<Home />', () => {
  it('renders without crashing', () => {
    renderWithRouterRedux(<Home />, {
      initialState: { ...getBlankInitialState(), auth: { ...blankUser, displayName: 'Jim Henderson' } },
    });
  });

  it('redirects when no user is present', () => {
    renderWithRouterRedux(<Home />, { redirectTo: '/' });
    expect(screen.getByText(/Redirected to a new page./)).toBeDefined();
  });
});

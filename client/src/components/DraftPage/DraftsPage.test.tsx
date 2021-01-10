import React from 'react';
import DraftPageRedux from '.';
import { renderWithRouterRedux } from '../../testUtils/reduxRender';

describe('<DraftsPage />', () => {
  it('renders without crashing', () => {
    renderWithRouterRedux(<DraftPageRedux />);
  });
});

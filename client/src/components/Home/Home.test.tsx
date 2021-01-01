import React from 'react';
import Home from '.';
import { renderWithRedux } from '../../testUtils/reduxRender';

describe('<Home />', () => {
  it('renders without crashing', () => {
    renderWithRedux(<Home />);
  });
});

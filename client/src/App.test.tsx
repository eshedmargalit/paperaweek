import React from 'react';
import App from './App';
import { renderWithRouterRedux } from './testUtils/reduxRender';

describe('<App />', () => {
  it('renders without crashing', () => {
    renderWithRouterRedux(<App />);
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';

describe('<NotFound />', () => {
  it('shows a stupid compass lol?', () => {
    render(<NotFound />);
    expect(screen.getByAltText(/compass/)).toBeInTheDocument();
  });
});

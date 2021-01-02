import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderCommaSepList } from './utils';

describe('utils', () => {
  describe('renderCommaSepList', () => {
    it('renders nothing when nothing is passed in', () => {
      expect(renderCommaSepList([])).toEqual([]);
    });

    it('renders one item without a comma separator', () => {
      const output = renderCommaSepList(['Shrek']);
      render(<div>{output}</div>);
      expect(screen.getByText(/Shrek/)).toBeDefined();
    });

    it('renders two items without a comma separator and an "and"', () => {
      const output = renderCommaSepList(['Shrek', 'Donkey']);
      render(<div>{output}</div>);
      expect(screen.getByText('Shrek')).toBeDefined();
      expect(screen.getByText('and Donkey')).toBeDefined();
    });

    it('renders 3 or more items with comma separation', () => {
      const output = renderCommaSepList(['Shrek', 'Donkey', 'Fiona', 'Father Time']);
      render(<div>{output}</div>);
      expect(screen.getByText(/Shrek,/)).toBeDefined();
      expect(screen.getByText(/Donkey,/)).toBeDefined();
      expect(screen.getByText(/Fiona/)).toBeDefined();
      expect(screen.getByText('and Father Time')).toBeDefined();
    });
  });
});

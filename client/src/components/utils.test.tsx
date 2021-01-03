import React from 'react';
import { render, screen } from '@testing-library/react';
import { removeMiddleAuthors, renderCommaSepList, shortenAuthors } from './utils';

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

  describe('removeMiddleAuthors', () => {
    const scenarios: {
      description: string;
      authorList: string[];
      numKeepEitherEnd: number;
      expectedResult: string[];
    }[] = [
      {
        description: 'with zero authors',
        authorList: [],
        numKeepEitherEnd: 0,
        expectedResult: [],
      },
      {
        description: 'few authors, keeping many on each end',
        authorList: ['Piranesi', 'The Other'],
        numKeepEitherEnd: 100,
        expectedResult: ['Piranesi', 'The Other'],
      },
      {
        description: 'many authors, keep 0 on either end',
        authorList: ['Piranesi', 'The Other'],
        numKeepEitherEnd: 0,
        expectedResult: ['Piranesi', 'The Other'],
      },
      {
        description: 'many authors, keep 2 on either end',
        authorList: ['Piranesi', 'The Other', 'The Biscuit Box Man', 'Sixteen', "Sylvia D'Agostino"],
        numKeepEitherEnd: 2,
        expectedResult: ['Piranesi', 'The Other', '...', 'Sixteen', "Sylvia D'Agostino"],
      },
    ];

    scenarios.forEach(({ description, authorList, numKeepEitherEnd, expectedResult }) => {
      it(`returns the correct result ${description}`, () => {
        expect(removeMiddleAuthors(authorList, numKeepEitherEnd)).toEqual(expectedResult);
      });
    });
  });

  describe('shortenAuthors', () => {
    // TODO EM: would this ever happen? Can we revise the functionality and rmeove this test?
    it('returns NAText when a single blank author is provided', () => {
      const output = shortenAuthors(['']);
      render(output as JSX.Element);
      expect(screen.getByText('N/A')).toBeDefined();
    });

    it('returns NAText when no authors are provided', () => {
      const output = shortenAuthors([]);
      render(output as JSX.Element);
      expect(screen.getByText('N/A')).toBeDefined();
    });

    const scenarios: {
      description: string;
      authors: string[];
      expectedOutput: string;
    }[] = [
      {
        description: 'with 2 authors',
        authors: ['Stephen Curry', 'Klay Thompson'],
        expectedOutput: 'Curry and Thompson',
      },
      {
        description: 'with 1 author',
        authors: ['Stephen Curry'],
        expectedOutput: 'Stephen Curry',
      },
      {
        description: 'with 3 authors',
        authors: ['Stephen Curry', 'Klay Thompson', 'Billy the Shooter'],
        expectedOutput: 'Curry et al.',
      },
    ];

    scenarios.forEach(({ description, authors, expectedOutput }) => {
      it(`returns the right string ${description}`, () => {
        expect(shortenAuthors(authors)).toEqual(expectedOutput);
      });
    });
  });
});

/* eslint-disable no-console */
/* eslint-disable no-return-assign */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { before } from 'lodash';
import {
  getTagColor,
  HSLString,
  isDOI,
  removeMiddleAuthors,
  renderCommaSepList,
  shortenAuthors,
  shortenTableString,
  wrapMarkdownWithMath,
} from './utils';

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
        description: 'with few authors, keeping many on each end',
        authorList: ['Piranesi', 'The Other'],
        numKeepEitherEnd: 100,
        expectedResult: ['Piranesi', 'The Other'],
      },
      {
        description: 'with many authors, keep 0 on either end',
        authorList: ['Piranesi', 'The Other'],
        numKeepEitherEnd: 0,
        expectedResult: ['Piranesi', 'The Other'],
      },
      {
        description: 'with many authors, keep 2 on either end',
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

  describe('shortenTableString', () => {
    const scenarios: {
      description: string;
      inString: string;
      cutoff: number;
      expectedText: string;
    }[] = [
      {
        description: 'with no string',
        inString: '',
        cutoff: -5,
        expectedText: 'N/A',
      },
      {
        description: 'with a string and a negative cutoff',
        inString: 'testing one two',
        cutoff: -5,
        expectedText: 'testing one two',
      },
      {
        description: 'with a string and a small cutoff',
        inString: 'testing one two',
        cutoff: 5,
        expectedText: 'testi...',
      },
      {
        description: 'with a string and a huge cutoff',
        inString: 'testing one two',
        cutoff: 500,
        expectedText: 'testing one two',
      },
    ];

    scenarios.forEach(({ description, inString, cutoff, expectedText }) => {
      it(`renders the correct element ${description}`, () => {
        render(shortenTableString(inString, cutoff));
        expect(screen.getByText(expectedText)).toBeDefined();
      });
    });
  });

  describe('getTagColor', () => {
    it('returns the same color for the same tag', () => {
      const tag = 'tag';
      expect(getTagColor(tag)).toEqual(getTagColor(tag));
    });
  });

  describe.skip('getReviewStats', () => {
    // TODO: once review data deserialization is figured out, write this test
  });

  describe('isDOI', () => {
    it('recognizes DOIs starting with 10', () => {
      expect(isDOI('10.1.1')).toBeTruthy();
    });

    it('recognizes DOIs with doi.org', () => {
      expect(isDOI('   doi.org   ')).toBeTruthy();
    });

    it('cannot be fooled by mere mortals', () => {
      expect(isDOI('   doI.org   ')).toBeFalsy();
      expect(isDOI('10 .1.1')).toBeFalsy();
    });
  });

  describe('wrapMarkdownWithMath', () => {
    // This is silly, but the react-katex library throws an ugly warning: https://github.com/talyssonoc/react-katex/issues/59
    // so we'll just suppress it :)
    const originalConsoleWarn = console.warn;
    beforeAll(() => (console.warn = jest.fn()));
    afterAll(() => (console.warn = originalConsoleWarn));

    it('does not alter non-math string', () => {
      const testString = 'The Year I Named the Constellations';
      render(wrapMarkdownWithMath(testString));
      expect(screen.getByText(testString)).toBeDefined();
    });

    it('renders math strings with markdown', () => {
      render(wrapMarkdownWithMath('$\\sum_0^\\infty$'));
      expect(screen.getAllByText(/∑/)).toBeDefined();
      expect(screen.getAllByText(/∞/)).toBeDefined();
    });
  });
});

/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
import React, { ElementType } from 'react';
import moment from 'moment';

import { InlineMath, BlockMath } from 'react-katex';
import math from 'remark-math';

import ReactMarkdown from 'react-markdown';

import 'katex/dist/katex.min.css';
import { Review } from '../types';
import { darkGray, pawGreen, pawRed } from '../colors';

export const renderCommaSepList = (items: string[], key: string): JSX.Element[] =>
  items.map((item, i) => {
    let toRender;
    if (i === items.length - 1) {
      // last
      if (items.length === 1) {
        toRender = (
          <span>
            {item}
            <br />
          </span>
        );
      } else {
        toRender = (
          <span>
            and {item}
            <br />
          </span>
        );
      }
    } else if (i === items.length - 2) {
      // penultimate
      toRender = <span>{item} </span>;
    } else {
      // all others
      toRender = <span>{item}, </span>;
    }
    return <span key={key}>{toRender}</span>;
  });

export const removeMiddleAuthors = (authorList: string[], numKeepEitherEnd: number): string[] => {
  const numAuthors = authorList.length;
  const numKeepTotal = numKeepEitherEnd * 2;
  if (numAuthors <= numKeepTotal) {
    return authorList;
  }

  const newAuthorList: string[] = [];
  newAuthorList.push(authorList[0]);
  newAuthorList.push(authorList[1]);
  newAuthorList.push('...');
  newAuthorList.push(authorList[authorList.length - 2]);
  newAuthorList.push(authorList[authorList.length - 1]);
  return newAuthorList;
};

export const shortenAuthors = (authors: string[]): string => {
  let authorString = '';

  if (authors.length === 2) {
    authorString = `${authors[0].split(' ').pop()} and ${authors[1].split(' ').pop()}`;
  } else if (authors.length === 1) {
    authorString = authors[0];
  } else {
    authorString = `${authors[0].split(' ').pop()} et al.`;
  }

  return authorString;
};

export const shortenString = (str: string, cutoff: number): string =>
  str.length >= cutoff ? `${str.substring(0, cutoff)}...` : str;

export type HSLString = string;
export type HexString = string;

export const getTagColor = (tag: string): HSLString => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }

  const shortened = hash % 360;
  const saturation = '80%';
  const lightness = '30%';
  return `hsl(${shortened},${saturation},${lightness})`;
};

export interface ReviewStats {
  numReviews: number;
  ppwString: string;
  ppwColor: HexString;
}

export const getReviewStats = (reviews: Review[]): ReviewStats => {
  if (reviews.length === 0) {
    return { numReviews: 0, ppwString: '0', ppwColor: darkGray };
  }

  const reviewDates = reviews.map(review => moment(review.createdAt));
  const sortedDates = reviewDates.sort((a, b) => a.diff(b));

  const diffs = [];
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = sortedDates[i + 1].diff(sortedDates[i], 'days');
    diffs.push(diff);
  }

  const totalWeeks = sortedDates[sortedDates.length - 1].diff(sortedDates[0], 'days') / 7.0;
  const ppw = sortedDates.length / totalWeeks;
  const ppwString = ppw.toFixed(2);

  const ppwColor = ppw >= 1 ? pawGreen : pawRed;
  const numReviews = reviews.length;

  return { numReviews, ppwString, ppwColor };
};

export const isDOI = (query: string): boolean => query.startsWith('10.') || query.includes('doi.org');

/**
 * This type comes from the ReactMarkdown package. We're declaring it ourselves because it isn't exported.
 */
type RenderersProps = { [nodeType: string]: ElementType };

export const wrapMarkdownWithMath = (markdownString: string): JSX.Element => {
  const renderers: RenderersProps = {
    inlineMath: ({ value }) => <InlineMath math={value} />,

    math: ({ value }) => <BlockMath math={value} />,
  };

  return (
    <ReactMarkdown plugins={[math]} renderers={renderers}>
      {markdownString}
    </ReactMarkdown>
  );
};

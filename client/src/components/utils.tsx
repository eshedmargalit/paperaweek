import React from 'react';
import moment from 'moment';

// @ts-ignore
import { InlineMath, BlockMath } from 'react-katex';
import math from 'remark-math';

import ReactMarkdown from 'react-markdown';

import 'katex/dist/katex.min.css';
import { Review } from '../types';

export const renderCommaSepList = (items: string[], key: string) => {
  return items.map((item, i) => {
    let to_render;
    if (i === items.length - 1) {
      // last
      if (items.length === 1) {
        to_render = (
          <span>
            {item}
            <br />
          </span>
        );
      } else {
        to_render = (
          <span>
            and {item}
            <br />
          </span>
        );
      }
    } else if (i === items.length - 2) {
      // penultimate
      to_render = (
        <span>
          {item}
          {` `}
        </span>
      );
    } else {
      //all others
      to_render = (
        <span>
          {item},{` `}
        </span>
      );
    }
    return <span key={key}>{to_render}</span>;
  });
};

export const removeMiddleAuthors = (authorList: string[], numKeepEitherEnd: number): string[] => {
  const numAuthors = authorList.length;
  const numKeepTotal = numKeepEitherEnd * 2;
  if (numAuthors <= numKeepTotal) {
    return authorList;
  }

  let newAuthorList: string[] = [];
  newAuthorList.push(authorList[0]);
  newAuthorList.push(authorList[1]);
  newAuthorList.push('...');
  newAuthorList.push(authorList[authorList.length - 2]);
  newAuthorList.push(authorList[authorList.length - 1]);
  return newAuthorList;
};

export const shortenAuthors = (authors: string[]): string => {
  let author_string: string = '';

  if (authors.length === 2) {
    author_string = authors[0].split(' ').pop() + ' and ' + authors[1].split(' ').pop();
  } else if (authors.length === 1) {
    author_string = authors[0];
  } else {
    author_string = authors[0].split(' ').pop() + ' et al.';
  }

  return author_string;
};

export const shortenString = (str: string, cutoff: number): string => {
  if (str.length >= cutoff) {
    str = str.substring(0, cutoff) + '...';
  }
  return str;
};

export type HSLString = string;
export type HexString = string;
export const getTagColor = (tag: string): HSLString => {
  var hash = 0;
  for (var i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }

  var shortened = hash % 360;
  const saturation = '80%';
  const lightness = '30%';
  return 'hsl(' + shortened + ',' + saturation + ',' + lightness + ')';
};

export interface ReviewStats {
  numReviews: number;
  ppwString: string;
  ppwColor: HexString;
}

export const getReviewStats = (reviews: Review[]): ReviewStats => {
  if (reviews.length === 0) {
    return { numReviews: 0, ppwString: '0', ppwColor: '#222222' };
  }

  const reviewDates = reviews.map(review => moment(review.createdAt));
  const sortedDates = reviewDates.sort((a, b) => a.diff(b));

  let diffs = [];
  for (var i = 0; i < sortedDates.length - 1; i++) {
    var diff = sortedDates[i + 1].diff(sortedDates[i], 'days');
    diffs.push(diff);
  }

  const totalWeeks = sortedDates[sortedDates.length - 1].diff(sortedDates[0], 'days') / 7.0;
  const ppw = sortedDates.length / totalWeeks;
  const ppwString = ppw.toFixed(2);

  const ppwColor = ppw >= 1 ? '#237804' : '#a8071a';
  const numReviews = reviews.length;

  return { numReviews, ppwString, ppwColor };
};

export const isDOI = (query: string): boolean => query.startsWith('10.') || query.includes('doi.org');

export const wrapMarkdownWithMath = (s: string) => {
  const renderers = {
    // @ts-ignore
    inlineMath: ({ value }) => <InlineMath math={value} />,

    // @ts-ignore
    math: ({ value }) => <BlockMath math={value} />,
  };

  return <ReactMarkdown plugins={[math]} renderers={renderers} children={s} />;
};
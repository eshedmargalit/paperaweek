/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
import React, { ElementType } from 'react';
import moment from 'moment';

import { InlineMath, BlockMath } from 'react-katex';
import math from 'remark-math';
import gfm from 'remark-gfm';

import ReactMarkdown from 'react-markdown';

import 'katex/dist/katex.min.css';
import { notification } from 'antd';
import { Review } from '../types';
import { darkGray, pawGreen, pawRed } from '../colors';
import NAText from './NAText';

export const stringNotEmpty = (s: string): boolean => s !== '';
export const stringArrayHasNonEmpty = (arr: string[]): boolean => arr.some((item) => stringNotEmpty(item));

export const renderCommaSepList = (items: string[]): JSX.Element[] =>
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
    return <span key={item}>{toRender}</span>;
  });

export const removeMiddleAuthors = (authorList: string[], numKeepEitherEnd: number): string[] => {
  const numAuthors = authorList.length;
  const numKeepTotal = numKeepEitherEnd * 2;
  if (numAuthors <= numKeepTotal || numKeepTotal === 0) {
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

export const shortenAuthors = (authors: string[]): JSX.Element | string => {
  if (!authors.length) return <NAText />;

  let authorString = '';

  if (authors.length === 2) {
    authorString = `${authors[0].split(' ').pop()} and ${authors[1].split(' ').pop()}`;
  } else if (authors.length === 1) {
    authorString = authors[0];
  } else {
    authorString = `${authors[0].split(' ').pop()} et al.`;
  }

  return authorString === '' ? <NAText /> : authorString;
};

export const shortenString = (str: string, cutoff: number): string =>
  str.length >= cutoff ? `${str.substring(0, cutoff)}...` : str;

export const shortenTableString = (str: string, cutoff: number): JSX.Element => {
  if (str === '') {
    return <NAText />;
  }

  if (cutoff <= 0) {
    return <span>{str}</span>;
  }

  return <span>{shortenString(str, cutoff)}</span>;
};

export type HexString = string;

export interface ReviewStats {
  numReviews: number;
  ppwString: string;
  ppwColor: HexString;
}

export const getReviewStats = (reviews: Review[]): ReviewStats => {
  if (reviews.length === 0) {
    return { numReviews: 0, ppwString: '0', ppwColor: darkGray };
  }

  const reviewDates = reviews.map((review) => moment(review.createdAt));
  const sortedDates = reviewDates.sort((a, b) => a.diff(b));

  const totalWeeks = moment().diff(sortedDates[0], 'days') / 7.0 || 1; // round up to 1 if totalWeeks === 0
  const ppw = sortedDates.length / totalWeeks;
  const ppwString = ppw.toFixed(2);
  const ppwColor = ppw >= 0.99 ? pawGreen : pawRed;
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

    // Prevent images from taking more than 90% of the preview box
    image: ({ alt, src, title }) => <img alt={alt} src={src} title={title} style={{ maxWidth: '90%' }} />,
  };

  return (
    <ReactMarkdown plugins={[gfm, math]} renderers={renderers}>
      {markdownString}
    </ReactMarkdown>
  );
};

export const makeHandleModalCopy = (userId: string) => (review: Review): void => {
  const link = `${window.location.origin}/profiles/${userId}/${review._id}`;
  navigator.clipboard.writeText(link);
  notification.success({
    message: 'Link Copied!',
  });
};

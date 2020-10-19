import React from 'react';
import moment from 'moment';

import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export function renderCommaSepList(items, key) {
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
    return <span key={key + item}>{to_render}</span>;
  });
}

export function removeMiddleAuthors(authorList, numKeepEitherEnd) {
  const numAuthors = authorList.length;
  const numKeepTotal = numKeepEitherEnd * 2;
  if (numAuthors <= numKeepTotal) {
    return authorList;
  }

  let newAuthorList = [];
  newAuthorList.push(authorList[0]);
  newAuthorList.push(authorList[1]);
  newAuthorList.push('...');
  newAuthorList.push(authorList[authorList.length - 2]);
  newAuthorList.push(authorList[authorList.length - 1]);
  return newAuthorList;
}

export function shortenAuthors(authors) {
  let author_string;

  if (authors.length === 2) {
    author_string = authors[0].split(' ').pop() + ' and ' + authors[1].split(' ').pop();
  } else if (authors.length === 1) {
    author_string = authors[0].split(' ').pop();
  } else {
    author_string = authors[0].split(' ').pop() + ' et al.';
  }

  return author_string;
}

export function shortenString(str, cutoff) {
  if (str.length >= cutoff) {
    str = str.substring(0, cutoff) + '...';
  }
  return str;
}

export function getTagColor(tag) {
  var hash = 0;
  for (var i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }

  var shortened = hash % 360;
  const saturation = '80%';
  const lightness = '30%';
  return 'hsl(' + shortened + ',' + saturation + ',' + lightness + ')';
}

export function getReviewStats(reviews) {
  if (reviews.length === 0) {
    return null;
  }

  const reviewDates = reviews.map(review => moment(review.createdAt));
  const sortedDates = reviewDates.sort((a, b) => a.diff(b));

  let diffs = [];
  for (var i = 0; i < sortedDates.length - 1; i++) {
    var diff = sortedDates[i + 1].diff(sortedDates[i], 'days');
    diffs.push(diff);
  }

  const totalWeeks = sortedDates[sortedDates.length - 1].diff(sortedDates[0], 'days') / 7.0;
  const ppw = Number.parseFloat(sortedDates.length / totalWeeks).toFixed(2);

  const ppwColor = ppw >= 1 ? '#237804' : '#a8071a';
  const numReviews = reviews.length;

  return { numReviews, ppw, ppwColor };
}

export function isDOI(query) {
  return query.startsWith('10.') || query.includes('doi.org');
}

function isEven(x) {
  return x % 2 === 0;
}

export function wrapMath(s, delimiter = '$') {
  const parts = s.split(delimiter);

  // now odds are not math, evens are math (always?)
  return (
    <>
      {parts.map((part, partIdx) => {
        const guts = isEven(partIdx) ? part : <InlineMath>{part}</InlineMath>;
        return <span key={`${s}_${part}_${partIdx}`}>{guts}</span>;
      })}
    </>
  );
}

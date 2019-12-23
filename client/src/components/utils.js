import React from 'react';

export function capital_case(input_str) {
  if (!input_str) {
    return '';
  }
  input_str = input_str.toLowerCase();
  const words = input_str.split(' ');

  var new_str = '';
  for (let i = 0; i < words.length; i++) {
    var word = words[i];
    if (
      word === 'and' ||
      word === 'or' ||
      word === 'in' ||
      word === 'of' ||
      word === 'the' ||
      word === 'an' ||
      word === 'at'
    ) {
      new_str += ' ' + word;
    } else {
      new_str += ' ' + word[0].toUpperCase() + word.substr(1).toLowerCase();
    }
  }

  return new_str;
}

export function render_comma_sep_list(items, key) {
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

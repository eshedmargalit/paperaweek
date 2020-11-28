import moment from 'moment';

// define the fields to pull from DOI string, and construct a regex to get the
// meat inside each
//
// Regex in English:
//     (?<=startingPattern) matches startingPattern before the main expression, but
//         doesn't include it in the final result
//     (?=closingPattern) matches closingPattern after the main expression, but
//         doesn't include it in the final result
//     (.*?) matches the first pattern (lazy) that can have any number (*) of any
//         character (.)
const targets = ['title', 'journal', 'DOI', 'author', 'year', 'month', 'url'] as const;
const regExs = {} as Record<typeof targets[number], RegExp>;

targets.forEach(target => {
  regExs[target] = new RegExp(`(?<=${target}={)(.*?)(?=})`, 'g');
});

// @ts-ignore
export const parsedDoiToPaper = parsedData => {
  // manipulate parsedData object into "paper" format
  const authors = parsedData.author.split(' and ');
  // @ts-ignore
  const authorsReordered = authors.map(author => {
    const parts = author.split(', ');
    return `${parts[1]} ${parts[0]}`;
  });
  const date = moment(`${parsedData.month}-${parsedData.year}`, 'MMM YYYY').format();

  const paper = {
    title: parsedData.title,
    journal: parsedData.journal,
    url: parsedData.url,
    doi: parsedData.DOI,
    authors: authorsReordered,
    date,
    institutions: null, // needs to be null instead of [] for front-end to render correctly
  };
  return { paper, id: parsedData.title };
};

export const parseDoiString = (doiString: string) => {
  // parse DOI string
  if (!doiString || !doiString.trim()) {
    return null;
  }

  const parsedData = {};
  targets.forEach(target => {
    // @ts-ignore
    let matchingData = doiString.match(regExs[target])[0];
    // @ts-ignore
    parsedData[target] = matchingData;
  });
  return parsedData;
};

export const doiToPaper = (doiString: string) => {
  const parsedData = parseDoiString(doiString);
  return parsedDoiToPaper(parsedData);
};

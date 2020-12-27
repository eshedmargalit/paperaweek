import moment from 'moment';
import { IPaper } from '../models/Paper';

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
type Target = typeof targets[number];
type ParsedData = Record<Target, string>;
export type ParsedPaper = Partial<IPaper>;

const regExs = {} as Record<Target, RegExp>;

targets.forEach(target => {
  regExs[target] = new RegExp(`(?<=${target}={)(.*?)(?=})`, 'g');
});

export const parsedDoiToPaper = (parsedData: Partial<ParsedData>): ParsedPaper | null => {
  // manipulate parsedData object into "paper" format
  if (!parsedData.author || !parsedData.title) {
    return null;
  }

  const authors = parsedData.author.split(' and ');

  // authors have last names first, so we reverse the order
  const authorsReordered = authors.map(author => {
    const parts = author.split(', ');
    return `${parts[1]} ${parts[0]}`;
  });

  const date = moment(`${parsedData.month || 'Jan'}-${parsedData.year}`, 'MMM YYYY').toDate();

  const paper: Partial<IPaper> = {
    title: parsedData.title,
    journal: parsedData.journal,
    url: parsedData.url,
    doi: parsedData.DOI,
    authors: authorsReordered,
    date,
    institutions: null, // needs to be null instead of [] for front-end to render correctly
  };
  return paper;
};

export const doiToPaper = (doiString: string): ParsedPaper | null => {
  const parsedData: Partial<ParsedData> = {};

  targets.forEach(target => {
    const matchingData = doiString.trim().match(regExs[target]);
    if (!matchingData) return;
    parsedData[target] = matchingData[0];
  });

  return parsedDoiToPaper(parsedData);
};

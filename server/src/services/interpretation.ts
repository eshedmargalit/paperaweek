import _ from 'lodash';
import { Entity, Interpretation } from '../types/interpretation';
import { ParsedPaper } from './doi';

export const capitalCase = (input: string): string => {
  if (!input.trim()) {
    return '';
  }

  const words = input.toLowerCase().trim().split(' ');

  const filtered = words.filter((word) => word !== '');

  return filtered.reduce(
    (accum, word) =>
      // If it's any of the following words, don't uppercase it
      ['and', 'or', 'in', 'of', 'the', 'an', 'at'].includes(word)
        ? `${accum} ${word}`
        : `${accum} ${word[0].toUpperCase()}${word.substr(1).toLowerCase()}`,
    ''
  );
};

export const processInterpretations = (interpretations: Interpretation[]): Entity[] => {
  const extracted = interpretations.map((interpretation) => interpretation.rules[0].output.entities);

  // flatten list of lists to a single list
  // const sortFn = (a: Entity, b: Entity) => a.logprob - b.logprob;
  return extracted.reduce((a, b) => a.concat(b), []);
};

export const processEntities = (entities: Entity[]): ParsedPaper[] =>
  entities.map((entity) => {
    // sort authors by position (first author first, etc)
    const authors = _.sortBy(entity.AA, [(o) => o.S]);

    // filter down to unique authors and remove empty entries
    let author_names = _.uniq(authors.map((author) => author.DAuN).filter((name) => name !== ''));
    let institutions = _.uniq(authors.map((author) => author.DAfN).filter((name) => name !== ''));

    if (author_names === undefined || author_names.length === 0) {
      author_names = [''];
    }

    if (institutions === undefined || institutions.length === 0) {
      institutions = [''];
    }

    let entity_url = '';
    if (entity.S && entity.S.length !== 0) {
      entity_url = entity.S[0].U;
    }

    const journal_name = entity.VFN || '';

    const paper = {
      title: entity.DN,
      authors: author_names,
      institutions,
      date: new Date(entity.D),
      doi: entity.DOI,
      journal: journal_name,
      url: entity_url,
    };
    return paper;
  });

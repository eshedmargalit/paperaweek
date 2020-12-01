import _ from 'lodash';
import { Entity } from '../types/interpretation';

export const capitalCase = (input: string) => {
  if (!input.trim()) {
    return '';
  }

  const words = input
    .toLowerCase()
    .trim()
    .split(' ');

  const filtered = words.filter(word => {
    return word !== '';
  });

  return filtered.reduce((accum, word) => {
    // If it's any of the following words, don't uppercase it
    return ['and', 'or', 'in', 'of', 'the', 'an', 'at'].includes(word)
      ? accum + ' ' + word
      : accum + ' ' + word[0].toUpperCase() + word.substr(1).toLowerCase();
  }, '');
};

export const processEntities = (entities: Entity[]) => {
  return entities.map(entity => {
    // sort authors by position (first author first, etc)
    const authors = _.sortBy(entity.AA, [
      function(o) {
        return o.S;
      },
    ]);

    // filter down to unique authors and remove empty entries
    let author_names = _.uniq(authors.map(author => capitalCase(author.DAuN.split('.').join('')))).filter(
      name => name !== ''
    );

    // filter down to unique institutions and remove empty entries
    let institutions = _.uniq(
      authors.map(author =>
        capitalCase(author.DAfN)
          .split('.')
          .join('')
          .trim()
      )
    ).filter(name => name !== '');

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

    let journal_name = entity.VFN || '';

    const paper = {
      title: entity.DN,
      authors: author_names,
      institutions: institutions,
      date: new Date(entity.D),
      doi: entity.DOI,
      journal: journal_name,
      url: entity_url,
    };
    return { paper: paper, id: entity.Id };
  });
};

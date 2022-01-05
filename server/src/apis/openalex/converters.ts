import { flatten as _flatten } from 'lodash';
import moment from 'moment';
import { IPaper } from '../../models/Paper';
import { Authorship, Work } from './types';

function authorshipsToAuthors(authorships: Authorship[]): string[] {
  return authorships.map((authorship) => authorship.author.display_name);
}

function authorshipsToInstitutions(authorships: Authorship[]): string[] {
  const institutionsByAuthorship = _flatten(authorships.map((authorship) => authorship.institutions));
  return institutionsByAuthorship.map((institution) => institution.display_name);
}

export function paperFromWork(work: Work): IPaper {
  return {
    title: work.display_name,
    authors: authorshipsToAuthors(work.authorships),
    institutions: authorshipsToInstitutions(work.authorships),
    date: moment(work.publication_date, 'YYYY-MM-DD').toDate(),
    journal: work.host_venue.display_name,
    doi: work.doi,
    url: work.host_venue.url,
  };
}

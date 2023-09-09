import { flatten as _flatten, uniq as _uniq } from 'lodash';
import moment from 'moment';
import { IPaper } from '../../models/Paper';
import { Author } from '../../services/search.types';
import { Authorship, AuthorsResponse, Work } from './types';

function authorshipsToAuthors(authorships: Authorship[]): string[] {
  return authorships.map((authorship) => authorship.author.display_name);
}

function authorshipsToInstitutions(authorships: Authorship[]): string[] {
  const institutionsByAuthorship = _flatten(authorships.map((authorship) => authorship.institutions));
  const institutionNames = institutionsByAuthorship.map((institution) => institution.display_name);
  return _uniq(institutionNames);
}

export function authorFromAuthorResponse(resp: AuthorsResponse): Author | null {
  const firstAuthor = resp.results[0];
  if (!firstAuthor) {
    return null;
  }
  return { name: firstAuthor.display_name, id: firstAuthor.id };
}

export function paperFromWork(work: Work): IPaper {
  const journal = work.primary_location.source?.display_name;
  return {
    title: work.display_name,
    authors: authorshipsToAuthors(work.authorships),
    institutions: authorshipsToInstitutions(work.authorships),
    date: moment(work.publication_date, 'YYYY-MM-DD').toDate(),
    journal: journal || '',
    doi: work.doi,
    url: work.primary_location.landing_page_url || '',
  };
}

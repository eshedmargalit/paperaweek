import { uniqBy as _uniqBy, flatten as _flatten } from 'lodash';
import { IPaper } from '../models/Paper';
import { getPapersByTitle, getPapersByDOI, getAuthorByName, getPapersByAuthor } from '../apis/openalex/openalex';
import { Author } from './search.types';

function isDOI(query: string): boolean {
  return query.startsWith('10.') || query.includes('doi.org');
}

async function searchByTitle(query: string): Promise<IPaper[]> {
  return getPapersByTitle(query);
}

async function searchByDOI(query: string): Promise<IPaper[]> {
  return isDOI(query) ? getPapersByDOI(query) : [];
}

async function searchByAuthor(query: string): Promise<IPaper[]> {
  const author: Author | null = await getAuthorByName(query);
  if (!author) {
    return [];
  }
  return getPapersByAuthor(author);
}

export default async function search(query: string): Promise<IPaper[]> {
  const papers = await Promise.all([searchByTitle(query), searchByDOI(query), searchByAuthor(query)]);
  console.log(papers);

  return _uniqBy(_flatten(papers), 'title');
}

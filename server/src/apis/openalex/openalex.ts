import axios from 'axios';
import { IPaper } from '../../models/Paper';
import { Author } from '../../services/search.types';
import { paperFromWork, authorFromAuthorResponse } from './converters';
import { AuthorsResponse, Work, WorksResponse } from './types';

const OPEN_ALEX_URL = 'https://api.openalex.org';
const MAILTO = 'paperaweek@protonmail.com';
const MAX_RESULTS = 5;

/**
 *
 * @param entity the entity you want from openAlex (e.g. works, authors)
 * @param parameters a dictionary of the parameters you want to search for
 * @param limit limits your query to MAX_RESULTS if true
 * @returns a Promise fulfilling the generic or null
 */
async function openAlexGet<T>(
  entity: string,
  parameters: Record<string, string> = {},
  limit = false
): Promise<T | null> {
  try {
    const response = await axios.get<T>(`${OPEN_ALEX_URL}/${entity}`, {
      params: {
        ...(limit ? { per_page: MAX_RESULTS } : undefined),
        mailto: MAILTO,
        ...parameters,
      },
    });

    if (response.data) {
      return response.data;
    }

    console.error(`Fetching ${entity} returned no data`);
    return null;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Failed to get ${entity}, error: ${err.message}`);
      console.error(err);
    }

    return null;
  }
}

export async function getPapersByTitle(title: string): Promise<IPaper[]> {
  const worksResponse = await openAlexGet<WorksResponse>('works', { filter: `title.search:${title}` }, true);
  if (!worksResponse) {
    return [];
  }

  return worksResponse.results.map(paperFromWork);
}

export async function getPapersByDOI(doi: string): Promise<IPaper[]> {
  const workResponse = await openAlexGet<Work>(`works/doi/${doi}`);
  if (!workResponse) {
    return [];
  }

  return [paperFromWork(workResponse)];
}

export async function getAuthorByName(name: string): Promise<Author | null> {
  const authorResponse = await openAlexGet<AuthorsResponse>('authors', {
    filter: `display_name.search:${name}`,
    sort: 'cited_by_count',
  });
  if (!authorResponse) {
    return null;
  }

  return authorFromAuthorResponse(authorResponse);
}

export async function getPapersByAuthor(author: Author): Promise<IPaper[]> {
  const worksResponse = await openAlexGet<WorksResponse>('works', { filter: `author.id:${author.id}` }, true);
  if (!worksResponse) {
    return [];
  }

  return worksResponse.results.map(paperFromWork);
}

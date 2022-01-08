import axios from 'axios';
import { IPaper } from '../../models/Paper';
import { Author } from '../../services/search.types';
import { paperFromWork, authorFromAuthorResponse } from './converters';
import { AuthorsResponse, Work, WorksResponse } from './types';

const OPEN_ALEX_URL = 'https://api.openalex.org';
const MAILTO = 'paperaweek@protonmail.com';
const MAX_RESULTS = 5;

export async function getPapersByTitle(title: string): Promise<IPaper[]> {
  try {
    const worksResponse = await axios.get<WorksResponse>(
      `${OPEN_ALEX_URL}/works?filter=title.search:${title}&per-page=${MAX_RESULTS}&mailto=${MAILTO}`
    );
    const papers: IPaper[] = worksResponse.data.results.map(paperFromWork);
    return papers;
  } catch (err) {
    return [];
  }
}

export async function getPapersByDOI(doi: string): Promise<IPaper[]> {
  try {
    const workResponse = await axios.get<Work>(`${OPEN_ALEX_URL}/works/doi:${doi}?mailto=${MAILTO}`);
    const paper: IPaper = paperFromWork(workResponse.data);
    return [paper];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getAuthorByName(name: string): Promise<Author | null> {
  try {
    const authorsResponse = await axios.get<AuthorsResponse>(
      `${OPEN_ALEX_URL}/authors?filter=display_name.search:${name}&sort=cited_by_count&mailto=${MAILTO}`
    );
    const author = authorFromAuthorResponse(authorsResponse.data);
    return author;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getPapersByAuthor(author: Author): Promise<IPaper[]> {
  try {
    const worksResponse = await axios.get<WorksResponse>(
      `${OPEN_ALEX_URL}/works?filter=author.id:${author.id}&per-page=${MAX_RESULTS}&mailto=${MAILTO}`
    );
    const papers: IPaper[] = worksResponse.data.results.map(paperFromWork);
    return papers;
  } catch (err) {
    return [];
  }
}

import axios from 'axios';
import { IPaper } from '../../models/Paper';
import { paperFromWork } from './converters';
import { Work, WorksResponse } from './types';

const OPEN_ALEX_URL = 'https://api.openalex.org';
const MAX_RESULTS = 5;

export async function getPapersByTitle(title: string): Promise<IPaper[]> {
  try {
    const worksResponse = await axios.get<WorksResponse>(
      `${OPEN_ALEX_URL}/works?filter=title.search:${title}&per-page=${MAX_RESULTS}`
    );
    const papers: IPaper[] = worksResponse.data.results.map(paperFromWork);
    return papers;
  } catch (err) {
    return [];
  }
}

export async function getPapersByDOI(doi: string): Promise<IPaper[]> {
  console.log(doi);
  try {
    const workResponse = await axios.get<Work>(`${OPEN_ALEX_URL}/works/doi:${doi}`);
    const paper: IPaper = paperFromWork(workResponse.data);
    return [paper];
  } catch (err) {
    console.log(err);
    return [];
  }
}

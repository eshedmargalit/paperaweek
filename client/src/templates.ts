import { Paper, Notes } from './types';

export const blankPaper: Paper = {
  title: '',
  authors: [],
  institutions: [],
  date: new Date(),
  journal: '',
  doi: '',
  url: '',
  keywords: [],
  one_sentence: '',
  review_date: new Date(),
};

export const blankNotes: Notes = {
  summary_points: [],
  background_points: [],
  approach_points: [],
  results_points: [],
  conclusions_points: [],
  other_points: [],
};

import { Notes, Paper } from '../../types';

export type StringObj = { contents: string };

type FormPaper = Omit<Paper, 'authors' | 'institutions'> & { authors: StringObj[]; institutions: StringObj[] };

type FormNotes = Pick<Notes, 'tldr' | 'keywords'> & {
  overview: StringObj[];
  background: StringObj[];
  methods: StringObj[];
  results: StringObj[];
  conclusions: StringObj[];
  other: StringObj[];
};

export type FormReview = {
  paper: FormPaper;
  notes: FormNotes;
};

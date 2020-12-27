import { Paper, Notes, Review, User } from './types';

export const blankUser: User = {
  googleId: '',
  displayName: '',
  reviews: [],
  readingList: [],
  drafts: [],
  publicProfile: false,
  renderMath: false,
};

export const blankPaper: Paper = {
  title: '',
  authors: [''],
  institutions: [''],
  date: new Date(),
  journal: '',
  doi: '',
  url: '',
};

export const blankNotes: Notes = {
  overview: [''],
  background: [''],
  methods: [''],
  results: [''],
  conclusions: [''],
  other: [''],
  tldr: '',
  keywords: [''],
};

export const blankReview: Review = {
  paper: blankPaper,
  notes: blankNotes,
};

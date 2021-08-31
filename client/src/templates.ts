import { Paper, Notes, Review, User, Profile } from './types';
import { demoReadingListItems, demoReviews } from './demoContent';

export const blankUser: User = {
  googleId: '',
  displayName: '',
  reviews: [],
  readingList: [],
  drafts: [],
  publicProfile: false,
  showTour: false,
  createdAt: new Date(),
};

/**
 * The demoUser is a fake user that's used to demonstrate how PAW might work
 * for users that aren't yet ready to sign up
 */
export const demoUser: User = {
  googleId: 'demo',
  displayName: 'Demo User',
  reviews: demoReviews,
  readingList: demoReadingListItems,
  drafts: [],
  publicProfile: false,
  showTour: true,
  createdAt: new Date(),
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

export const blankProfile: Profile = {
  isOwnPage: true,
};

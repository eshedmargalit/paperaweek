export type Maybe<T> = T | null;
/**
 * MongoID represents a Mongo object ID, is always a string
 */
export type MongoID = string;

export interface Paper {
  title: string;
  authors: string[];
  institutions: string[] | null;
  date: Date;
  journal: string;
  doi: string;
  url: string;
  keywords: string[];
  one_sentence: string;
  review_date: Date;
}

export interface Notes {
  summary_points: string[];
  background_points: string[];
  approach_points: string[];
  results_points: string[];
  conclusions_points: string[];
  other_points: string[];
}

export interface Review {
  id?: MongoID;
  paper: Paper;
  notes: Notes;
}

export interface User {
  displayName: string;
  reviews: Review[];
  readingList: Paper[];
  drafts: Review[];
  lastLogin?: number;
  publicProfile: boolean;
  renderMath: boolean;
}

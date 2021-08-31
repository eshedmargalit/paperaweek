export type Maybe<T> = T | null;
/**
 * MongoID represents a Mongo object ID, is always a string
 */
export type MongoID = string;
export type Color = string;

export interface Paper {
  _id?: MongoID;
  createdAt?: Date;
  title: string;
  authors: string[];
  institutions: string[];
  date: Date;
  journal?: string;
  doi?: string;
  url?: string;
}

export interface Notes {
  overview: string[];
  background: string[];
  methods: string[];
  results: string[];
  conclusions: string[];
  other: string[];
  tldr: string;
  keywords: string[];
}

export interface Review {
  _id?: MongoID;
  createdAt?: Date;
  paper: Paper;
  notes: Notes;
}

export interface User {
  googleId: string;
  displayName: string;
  reviews: Review[];
  readingList: Paper[];
  drafts: Review[];
  publicProfile: boolean;
  showTour: boolean;
  createdAt: Date;
}

export interface Profile {
  userDisplayName?: string;
  reviews?: Review[];
  isOwnPage: boolean;
}

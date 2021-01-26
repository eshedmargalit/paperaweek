import { Paper, Review, User } from './types';

export type PaperResponse = Omit<Paper, 'createdAt' | 'date'> & {
  createdAt: string;
  date: string;
};

export type ReviewResponse = Omit<Review, 'createdAt' | 'paper'> & {
  createdAt: string;
  paper: PaperResponse;
};

export type UserResponse = Omit<User, 'reviews' | 'readingList' | 'drafts'> & {
  reviews: ReviewResponse[];
  readingList: PaperResponse[];
  drafts: ReviewResponse[];
};

export const constructPaperFromResponse = (paperResponse: PaperResponse): Paper => ({
  ...paperResponse,
  createdAt: new Date(paperResponse.createdAt),
  date: new Date(paperResponse.date),
});

export const constructReviewFromResponse = (reviewResponse: ReviewResponse): Review => ({
  ...reviewResponse,
  createdAt: new Date(reviewResponse.createdAt),
  paper: constructPaperFromResponse(reviewResponse.paper),
});

export const constructUserFromResponse = (userResponse: UserResponse): User => ({
  ...userResponse,
  reviews: userResponse.reviews.map(constructReviewFromResponse),
  drafts: userResponse.drafts.map(constructReviewFromResponse),
  readingList: userResponse.readingList.map(constructPaperFromResponse),
});

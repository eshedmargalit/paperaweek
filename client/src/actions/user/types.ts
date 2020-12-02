export const FETCH_USER = 'FETCH_USER';

export interface User {
  displayName: string;
  reviews: any[];
  readingList: any[];
  drafts: any[];
  lastLogin?: number;
  publicProfile: boolean;
  renderMath: boolean;
}

export interface FetchUserAction {
  type: typeof FETCH_USER;
  payload: User;
}

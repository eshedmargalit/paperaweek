import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { Review, User } from '../../types';
import MenuBarContainer from './MenuBar-container';

export default function MenuBarRedux(): JSX.Element {
  const user: User = useSelector((state: RootState) => state.user);
  const drafts: Review[] = useSelector((state: RootState) => state.drafts);

  return <MenuBarContainer user={user} numberOfDrafts={drafts.length} />;
}

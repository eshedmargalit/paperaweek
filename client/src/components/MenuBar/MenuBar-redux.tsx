import React from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';

import { Review, User } from '../../types';
import MenuBarContainer from './MenuBar-container';

export default function MenuBarRedux(): JSX.Element {
  const user: User = useAppSelector((state) => state.user);
  const drafts: Review[] = useAppSelector((state) => state.drafts);
  const { demoMode } = useAppSelector((state) => state.auth);

  return <MenuBarContainer user={user} numberOfDrafts={drafts.length} isDemo={demoMode} />;
}

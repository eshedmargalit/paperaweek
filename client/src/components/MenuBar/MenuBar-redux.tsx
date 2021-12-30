import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { updateTheme } from '../../slices/themeSlice';
import { ThemeColor } from '../../theming/themes';

import { Review, User } from '../../types';
import MenuBarContainer from './MenuBar-container';

export default function MenuBarRedux(): JSX.Element {
  const dispatch = useAppDispatch();
  const user: User = useAppSelector((state) => state.user);
  const drafts: Review[] = useAppSelector((state) => state.drafts);
  const { demoMode } = useAppSelector((state) => state.auth);
  const themeState = useAppSelector((state) => state.theme);
  const handleUpdateTheme = (newColor: ThemeColor) => dispatch(updateTheme(newColor));

  return (
    <MenuBarContainer
      user={user}
      numberOfDrafts={drafts.length}
      isDemo={demoMode}
      updateTheme={handleUpdateTheme}
      {...themeState}
    />
  );
}

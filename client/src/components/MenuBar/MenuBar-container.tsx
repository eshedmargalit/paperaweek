import React from 'react';
import { saveTheme, ThemeColor } from '../../theming/themes';
import MenuBarView, { MenuBarViewProps } from './MenuBar-view';

// Right now, we just pass the container props directly to the view
// If the container ever needs differing props, adjust or remove this alias.
type MenuBarContainerProps = MenuBarViewProps;

export default function MenuBarContainer(props: MenuBarContainerProps): JSX.Element {
  const { updateTheme } = props;

  // When theme is updated, persist to storage
  const handleUpdateTheme = (newColor: ThemeColor) => {
    updateTheme(newColor);
    saveTheme(newColor);
  };

  return <MenuBarView {...props} updateTheme={handleUpdateTheme} />;
}

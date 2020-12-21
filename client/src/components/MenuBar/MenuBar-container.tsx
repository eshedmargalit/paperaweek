import React from 'react';
import MenuBarView, { MenuBarViewProps } from './MenuBar-view';

// Right now, we just pass the container props directly to the view
// If the container ever needs differing props, adjust or remove this alias.
type MenuBarContainerProps = MenuBarViewProps;

export default function MenuBarContainer(props: MenuBarContainerProps): JSX.Element {
  return <MenuBarView {...props} />;
}

import React from 'react';
import PreferencesView, { PreferencesViewProps } from './Preferences-view';

// These are currently the same, so we're using a type alias.
type PreferencesContainerProps = PreferencesViewProps;

export default function PreferencesContainer(props: PreferencesContainerProps): JSX.Element {
  return <PreferencesView {...props} />;
}

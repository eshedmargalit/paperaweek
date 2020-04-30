import React, { Component } from 'react';
import PreferencesView from './Preferences-view';

class PreferencesContainer extends Component {
  render() {
    return <PreferencesView {...this.props} />;
  }
}

export default PreferencesContainer;

import React, { Component } from 'react';
import DraftsView from './Drafts-view';

class DraftsContainer extends Component {
  render() {
    return <DraftsView {...this.props} />;
  }
}

export default DraftsContainer;

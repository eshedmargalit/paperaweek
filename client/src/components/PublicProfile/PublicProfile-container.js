import React, { Component } from 'react';
import PublicProfileView from './PublicProfile-view';

class PublicProfileContainer extends Component {
  render() {
    return <PublicProfileView {...this.props} />;
  }
}

export default PublicProfileContainer;

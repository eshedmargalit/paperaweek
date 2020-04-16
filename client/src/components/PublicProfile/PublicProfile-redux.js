import React, { Component } from 'react';
import PublicProfileContainer from './PublicProfile-container';

class PublicProfileRedux extends Component {
  render() {
    // match URL
    let { match } = this.props;
    const { userId } = match.params;
    return <PublicProfileContainer />;
  }
}

export default PublicProfileRedux;

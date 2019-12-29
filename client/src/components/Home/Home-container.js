import React, { Component } from 'react';
import HomeView from './Home-view';

class HomeContainer extends Component {
  render() {
    return <HomeView {...this.props} />;
  }
}

export default HomeContainer;

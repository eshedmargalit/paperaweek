import React, { Component } from 'react';
import HomeView from './Home-view';

class HomeContainer extends Component {
  render() {
    return <HomeView user={this.props.user} showForm={this.props.showForm} signOut={this.props.signOut} />;
  }
}

export default HomeContainer;

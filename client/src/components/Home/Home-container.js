import React, { Component } from 'react';
import HomeView from './Home-view';

class HomeContainer extends Component {
  render() {
    let { user, showForm, signOut } = this.props;
    return <HomeView user={user} showForm={showForm} signOut={signOut} />;
  }
}

export default HomeContainer;

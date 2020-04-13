import React, { Component } from 'react';
import MenuBarView from './MenuBar-view';

class MenuBarContainer extends Component {
  render() {
    return <MenuBarView {...this.props} />;
  }
}

export default MenuBarContainer;

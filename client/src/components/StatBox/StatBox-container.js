import React, { Component } from 'react';
import StatBoxView from './StatBox-view';

class StatBoxContainer extends Component {
  render() {
    return <StatBoxView {...this.props} />;
  }
}

export default StatBoxContainer;

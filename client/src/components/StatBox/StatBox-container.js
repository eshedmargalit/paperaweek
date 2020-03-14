import React, { Component } from 'react';
import StatBoxView from './StatBox-view';

class StatBoxContainer extends Component {
  render() {
    console.log(this.props);
    return <StatBoxView {...this.props} />;
  }
}

export default StatBoxContainer;

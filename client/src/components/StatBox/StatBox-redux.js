import React, { Component } from 'react';
import { connect } from 'react-redux';
import StatBoxContainer from './StatBox-container';

class StatBoxRedux extends Component {
  render() {
    return <StatBoxContainer {...this.props} />;
  }
}

const mapStateToProps = ({ reviews }) => {
  return {
    reviews,
  };
};

export default connect(
  mapStateToProps,
  null
)(StatBoxRedux);

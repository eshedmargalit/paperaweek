import React, { Component } from 'react';
import { connect } from 'react-redux';
import DraftsContainer from './Drafts-container';

class DraftsRedux extends Component {
  render() {
    return <DraftsContainer />;
  }
}

const mapStateToProps = ({ user, activeReview }) => {
  return {
    user,
    activeReview,
  };
};

export default connect(
  mapStateToProps,
  null
)(DraftsRedux);

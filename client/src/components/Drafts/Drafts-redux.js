import React, { Component } from 'react';
import { connect } from 'react-redux';
import DraftsContainer from './Drafts-container';

class DraftsRedux extends Component {
  render() {
    return <DraftsContainer {...this.props} />;
  }
}

const mapStateToProps = ({ user, drafts }) => {
  return {
    user,
    drafts,
  };
};

export default connect(
  mapStateToProps,
  null
)(DraftsRedux);

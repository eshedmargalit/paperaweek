import React, { Component } from 'react';
import { connect } from 'react-redux';
import MenuBarContainer from './MenuBar-container';

class MenuBarRedux extends Component {
  render() {
    let { user, drafts, points } = this.props;
    return <MenuBarContainer points={points} user={user} numberOfDrafts={drafts.length} />;
  }
}

const mapStateToProps = ({ user, points, activeReview, drafts }) => {
  return {
    user,
    points,
    activeReview,
    drafts,
  };
};

export default connect(mapStateToProps, null)(MenuBarRedux);

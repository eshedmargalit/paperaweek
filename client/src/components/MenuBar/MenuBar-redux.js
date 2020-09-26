import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../../actions';
import MenuBarContainer from './MenuBar-container';

class MenuBarRedux extends Component {
  componentDidMount() {
    this.props.dispatch(fetchUser());
  }

  render() {
    let { user, drafts } = this.props;
    return <MenuBarContainer user={user} numberOfDrafts={drafts.length} />;
  }
}

const mapStateToProps = ({ user, activeReview, drafts }) => {
  return {
    user,
    activeReview,
    drafts,
  };
};

export default connect(mapStateToProps, null)(MenuBarRedux);

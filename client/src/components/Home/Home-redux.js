import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUser, updateDrafts } from '../../actions';
import HomeContainer from './Home-container';

class HomeRedux extends Component {
  componentDidMount() {
    console.log('mounted');
    this.props.dispatch(fetchUser());
  }

  render() {
    let { user, activeReview, drafts } = this.props;
    return <HomeContainer user={user} showForm={activeReview.showForm} numberOfDrafts={drafts.length} />;
  }
}

const mapStateToProps = ({ user, activeReview, drafts }) => {
  return {
    user,
    activeReview,
    drafts,
  };
};

export default connect(
  mapStateToProps,
  null
)(HomeRedux);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../../actions';
import HomeContainer from './Home-container';

class HomeRedux extends Component {
  componentDidMount() {
    this.props.dispatch(fetchUser());
  }

  render() {
    let { user, activeReview, drafts, points } = this.props;
    return (
      <HomeContainer points={points} user={user} showForm={activeReview.showForm} numberOfDrafts={drafts.length} />
    );
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

export default connect(
  mapStateToProps,
  null
)(HomeRedux);

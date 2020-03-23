import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateReadingList, updateReviews, updateDrafts, loginSuccess, loginFailed, loginPending } from '../../actions';
import HomeContainer from './Home-container';

class HomeRedux extends Component {
  async componentDidMount() {
    this.props.dispatch(loginPending());
    const user = await fetch('/api/current_user').then(r => r.json());

    try {
      this.props.dispatch(loginSuccess(user.displayName));
      this.props.dispatch(updateReviews(user.reviews));
      this.props.dispatch(updateReadingList(user.readingList));
      this.props.dispatch(updateDrafts(user.drafts));
    } catch (error) {
      this.props.dispatch(loginFailed());
    }
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

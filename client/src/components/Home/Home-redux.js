import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateReadingList, updateReviews, updateDrafts, loginSuccess, loginFailed, loginPending } from '../../actions';
import HomeContainer from './Home-container';

class HomeRedux extends Component {
  async componentDidMount() {
    this.props.dispatch(loginPending());

    let { auth } = this.props;

    // parse return URL from cognito
    auth.parseCognitoWebResponse(window.location.href);

    // send JWT to backend
    let auth_data;

    try {
      // Only go fetch auth again if I don't have a userid
      if (!this.props.user.userid || !this.props.user.userid.length) {
        auth_data = await fetch('/api/auth', {
          headers: {
            'content-type': 'application/json',
            idToken: auth.signInUserSession.idToken.jwtToken,
          },
        }).then(response => response.json());
      }

      this.props.dispatch(loginSuccess(auth_data.display_name, auth_data._id));
      this.props.dispatch(updateReviews(auth_data.reviews));
      this.props.dispatch(updateReadingList(auth_data.reading_list));
      this.props.dispatch(updateDrafts(auth_data.drafts));
    } catch (error) {
      this.props.dispatch(loginFailed(error));
    }
  }

  render() {
    let { user, activeReview, auth, drafts } = this.props;
    let boundSignOut = auth.signOut.bind(auth);
    return (
      <HomeContainer
        user={user}
        showForm={activeReview.showForm}
        signOut={boundSignOut}
        numberOfDrafts={drafts.length}
      />
    );
  }
}

const mapStateToProps = ({ user, activeReview, drafts }) => {
  return {
    user,
    activeReview,
    drafts,
  };
};

export default connect(mapStateToProps, null)(HomeRedux);

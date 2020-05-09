import React, { Component } from 'react';
import { connect } from 'react-redux';
import PreferencesContainer from './Preferences-container';

class PreferencesRedux extends Component {
  render() {
    let { user, auth } = this.props;
    const initialValues = {
      displayName: user.displayName,
      publicProfile: user.publicProfile,
    };
    return <PreferencesContainer auth={auth} profileId={user.googleId} initialValues={initialValues} />;
  }
}

const mapStateToProps = ({ user, auth }) => {
  return { user, auth };
};

export default connect(mapStateToProps, null)(PreferencesRedux);

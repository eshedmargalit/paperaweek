import React from 'react';
import { connect } from 'react-redux';
import PreferencesContainer from './Preferences-container';
import axios from 'axios';

function PreferencesRedux({ auth, user, onChange }) {
  const saveResults = async values => {
    let returnedUser = await axios.put('/api/user', values);
    onChange();
  };

  let { googleId, publicProfile } = user;
  const initialValues = { publicProfile };

  return (
    <PreferencesContainer auth={auth} profileId={googleId} initialValues={initialValues} saveResults={saveResults} />
  );
}

const mapStateToProps = ({ user, auth }) => {
  return { user, auth };
};

export default connect(mapStateToProps, null)(PreferencesRedux);

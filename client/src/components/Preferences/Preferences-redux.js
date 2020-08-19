import React from 'react';
import { connect } from 'react-redux';
import PreferencesContainer from './Preferences-container';
import axios from 'axios';

function PreferencesRedux({ auth, user, onChange }) {
  const saveResults = async values => {
    await axios.put('/api/user', values);
    onChange();
  };

  let { publicProfile } = user;
  const initialValues = { publicProfile };

  return <PreferencesContainer auth={auth} initialValues={initialValues} saveResults={saveResults} />;
}

const mapStateToProps = ({ user, auth }) => {
  return { user, auth };
};

export default connect(mapStateToProps, null)(PreferencesRedux);

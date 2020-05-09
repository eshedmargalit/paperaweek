import React, { useState } from 'react';
import { connect } from 'react-redux';
import PreferencesContainer from './Preferences-container';
import axios from 'axios';

function PreferencesRedux({ auth, user }) {
  const [updating, setUpdating] = useState(false);

  const onFinish = async values => {
    setUpdating(true);
    let returnedUser = await axios.put('api/user', values);
    setUpdating(false);
  };

  let { displayName, googleId, publicProfile } = user;
  const initialValues = { displayName, publicProfile };

  return (
    <PreferencesContainer
      auth={auth}
      profileId={googleId}
      initialValues={initialValues}
      onFinish={onFinish}
      updating={updating}
    />
  );
}

const mapStateToProps = ({ user, auth }) => {
  return { user, auth };
};

export default connect(mapStateToProps, null)(PreferencesRedux);

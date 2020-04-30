import React, { Component } from 'react';
import { connect } from 'react-redux';
import PreferencesContainer from './Preferences-container';

class PreferencesRedux extends Component {
  render() {
    let { user, auth } = this.props;
    const settings = [
      {
        name: 'Display Name',
        type: 'text',
        currentValue: user.displayName,
      },
      {
        name: '',
        type: 'bool',
        currentValue: user.publicProfile,
      },
    ];
    return <PreferencesContainer auth={auth} settings={settings} />;
  }
}

const mapStateToProps = ({ user, auth }) => {
  return { user, auth };
};

export default connect(
  mapStateToProps,
  null
)(PreferencesRedux);

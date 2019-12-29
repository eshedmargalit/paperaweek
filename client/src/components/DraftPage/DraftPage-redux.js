import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Drafts from '../Drafts';

import './DraftPage.scss';

class DraftPageRedux extends Component {
  render() {
    const homeRedirect = <Redirect to="/dashboard" push />;
    const { user } = this.props;
    const hasUser = user.userid !== '';
    return hasUser ? (
      <div className="width80">
        <Drafts />
      </div>
    ) : (
      homeRedirect
    );
  }
}

const mapStateToProps = ({ user }) => {
  return {
    user,
  };
};

export default connect(
  mapStateToProps,
  null
)(DraftPageRedux);

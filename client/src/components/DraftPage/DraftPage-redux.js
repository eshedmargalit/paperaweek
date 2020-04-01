import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Drafts from '../Drafts';

import './DraftPage.scss';

class DraftPageRedux extends Component {
  render() {
    const homeRedirect = <Redirect to="/" push />;
    return this.props.auth ? (
      <div className="width80">
        <Drafts />
      </div>
    ) : (
      homeRedirect
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    auth,
  };
};

export default connect(
  mapStateToProps,
  null
)(DraftPageRedux);

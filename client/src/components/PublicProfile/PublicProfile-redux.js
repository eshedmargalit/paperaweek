import React, { Component } from 'react';
import { connect } from 'react-redux';
import PublicProfileContainer from './PublicProfile-container';

class PublicProfileRedux extends Component {
  render() {
    // match URL
    let { match, reviews } = this.props;
    const { userId } = match.params;
    const userDisplayName = 'Carl';
    return <PublicProfileContainer userDisplayName={userDisplayName} reviews={reviews} />;
  }
}

const mapStateToProps = ({ reviews }) => {
  return {
    reviews,
  };
};

export default connect(
  mapStateToProps,
  null
)(PublicProfileRedux);

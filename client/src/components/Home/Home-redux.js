import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeContainer from './Home-container';

class HomeRedux extends Component {
  render() {
    let { auth, activeReview } = this.props;
    return <HomeContainer auth={auth} showForm={activeReview.showForm} />;
  }
}

const mapStateToProps = ({ auth, activeReview }) => {
  return { auth, activeReview };
};

export default connect(mapStateToProps, null)(HomeRedux);

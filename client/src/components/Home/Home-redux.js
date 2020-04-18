import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../../actions';
import HomeContainer from './Home-container';

class HomeRedux extends Component {
  componentDidMount() {
    this.props.dispatch(fetchUser());
  }

  render() {
    let { auth, activeReview } = this.props;
    return <HomeContainer auth={auth} showForm={activeReview.showForm} />;
  }
}

const mapStateToProps = ({ auth, activeReview }) => {
  return { auth, activeReview };
};

export default connect(
  mapStateToProps,
  null
)(HomeRedux);

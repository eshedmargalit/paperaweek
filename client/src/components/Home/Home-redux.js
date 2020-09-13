import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../../actions';
import HomeContainer from './Home-container';

class HomeRedux extends Component {
  componentDidMount() {
    this.props.dispatch(fetchUser());
  }

  render() {
    let { auth } = this.props;
    return <HomeContainer auth={auth} />;
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};

export default connect(mapStateToProps, null)(HomeRedux);

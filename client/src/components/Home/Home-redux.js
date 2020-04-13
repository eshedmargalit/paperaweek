import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../../actions';
import HomeContainer from './Home-container';

class HomeRedux extends Component {
  componentDidMount() {
    this.props.dispatch(fetchUser());
  }

  render() {
    let { activeReview } = this.props;
    return <HomeContainer showForm={activeReview.showForm} />;
  }
}

const mapStateToProps = ({ activeReview }) => {
  return { activeReview };
};

export default connect(
  mapStateToProps,
  null
)(HomeRedux);

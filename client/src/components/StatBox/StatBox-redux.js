import React, { Component } from 'react';
import { connect } from 'react-redux';
import StatBoxContainer from './StatBox-container';
import { setReview } from '../../actions';

class StatBoxRedux extends Component {
  startBlankReview = () => {
    this.props.dispatch(setReview(null, null));
  };

  render() {
    return (
      <StatBoxContainer reviews={this.props.reviews.reviewList} startBlankReview={this.startBlankReview.bind(this)} />
    );
  }
}

const mapStateToProps = ({ reviews }) => {
  return {
    reviews,
  };
};

export default connect(mapStateToProps, null)(StatBoxRedux);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import StatsCarouselContainer from './StatsCarousel-container';

class StatsCarouselRedux extends Component {
  render() {
    return <StatsCarouselContainer {...this.props} />;
  }
}

const mapStateToProps = ({ reviews, readingList, drafts }) => {
  return {
    reviews,
    readingList,
    drafts,
  };
};

export default connect(
  mapStateToProps,
  null
)(StatsCarouselRedux);

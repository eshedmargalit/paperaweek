import React, { Component } from 'react';
import StatsCarouselView from './StatsCarousel-view';

class StatsCarouselContainer extends Component {
  render() {
    console.log(this.props);
    return <StatsCarouselView {...this.props} />;
  }
}

export default StatsCarouselContainer;

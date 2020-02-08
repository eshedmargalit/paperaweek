import React from 'react';
import { Carousel } from 'antd';

import FrequencyChart from '../FrequencyChart';

import './StatsCarousel.scss';

function StatsCarouselView({ reviews, readingList, drafts }) {
  // TODO: do something with the real data
  const renderCarousel = carouselItems => {
    return (
      <Carousel className="carousel" autoplay speed={2000}>
        {carouselItems.map(item => {
          return (
            <div className="carousel__content" key={`carousel ${item}`}>
              {item}
            </div>
          );
        })}
      </Carousel>
    );
  };

  const frequencyChart = FrequencyChart(reviews);
  const carouselItems = [frequencyChart, 'placeholder test'];
  const carousel = renderCarousel(carouselItems);
  return <div>{carousel}</div>;
}

export default StatsCarouselView;

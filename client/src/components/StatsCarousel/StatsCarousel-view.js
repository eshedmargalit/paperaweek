import React from 'react';
import { Carousel } from 'antd';

import './StatsCarousel.scss';

function StatsCarouselView({ reviews, readingList, drafts }) {
  // TODO: do something with the real data
  const renderCarousel = carouselItems => {
    return (
      <Carousel className="carousel" autoplay speed={1000}>
        {carouselItems.map(item => {
          return (
            <h3 className="carousel__content" key={`carousel ${item}`}>
              {item}
            </h3>
          );
        })}
      </Carousel>
    );
  };

  const carouselItems = ['test', 'test2'];
  const carousel = renderCarousel(carouselItems);
  return <div>{carousel}</div>;
}

export default StatsCarouselView;

import React, { Component } from 'react';
import { Carousel, Icon, Button, Input, PageHeader } from 'antd';

import { render_comma_sep_list } from '../utils';
import './PaperSearchBar.scss';

class PaperSearchBarView extends Component {
  renderCarousel = carouselItems => {
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

  renderSearchResults = searchResults => {
    const renderedSearchResults = searchResults.map(result => {
      let { paper, id } = result;
      let { title, journal, date, authors } = paper;
      let year = date.getYear();
      let author_names_list = render_comma_sep_list(authors, 'author_names');
      return (
        <div
          className="searchResult"
          key={id}
          onClick={() => {
            this.props.handleClickResult(result);
          }}
        >
          <div className="paperSearch__result">
            <div>
              <strong>{title}</strong>
              <br />
              {author_names_list}
            </div>
          </div>
          <em>
            {journal}
            {` `}
            {year}
          </em>
          <div>
            <Button
              size="small"
              onClick={e => {
                e.stopPropagation();
                this.props.handleClickResultButton(result);
              }}
            >
              Start Review Now <Icon type="form" />
            </Button>
          </div>
        </div>
      );
    });
    return renderedSearchResults;
  };

  render() {
    const { carouselItems, handleSearch, startBlankReview, searchResults, query } = this.props;
    let carousel = this.renderCarousel(carouselItems);

    let renderedSearchResults = [];
    if (searchResults) {
      renderedSearchResults = this.renderSearchResults(searchResults);
    }

    const search_area = (
      <div>
        <div>
          <PageHeader title="Write a Review" subTitle="Search online for papers" avatar={{ icon: 'file-search' }} />
        </div>
        <div className="paperSearch__input">
          <Input
            type="text"
            width="50%"
            onChange={e => handleSearch(`${e.target.value}`)}
            placeholder="e.g., Retinal waves nature 2012"
            value={query}
            allowClear
          />
          <Button onClick={startBlankReview}>
            Create Manual Entry <Icon type="plus-circle" />
          </Button>
        </div>
      </div>
    );

    return (
      <div>
        <br />
        {search_area}
        {renderedSearchResults.length ? renderedSearchResults : carousel}
      </div>
    );
  }
}

export default PaperSearchBarView;

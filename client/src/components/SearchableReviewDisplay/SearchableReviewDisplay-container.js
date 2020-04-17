import React, { Component } from 'react';
import SearchableReviewDisplayView from './SearchableReviewDisplay-view';
import Fuse from 'fuse.js';

class SearchableReviewDisplayContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      selectedReview: null,
      showModal: false,
    };
  }

  handleSearch = query => {
    this.setState({ query });
  };

  reviewClicked = review => {
    this.setState({
      selectedReview: review,
      showModal: true,
    });
  };

  handleModalClose = () => {
    this.setState({
      selectedReview: null,
      showModal: false,
    });
  };

  deleteConfirmHandler = () => {
    this.props.deleteReview(this.state.selectedReview);
    this.setState({
      showModal: false,
    });
  };

  modalEditHandler = () => {
    this.props.handleModalEdit(this.state.selectedReview);
  };

  fuzzyFilterReviews = reviews => {
    if (this.state.query === '') {
      return reviews;
    }
    var options = {
      shouldSort: false,
      threshold: 0.2,
      location: 0,
      distance: 5000,
      maxPatternLength: 32,
      minMatchCharLength: 4,
      keys: ['paper.title', 'paper.authors', 'paper.keywords', 'paper.date'],
    };

    var fuse = new Fuse(reviews, options);
    const results = fuse.search(this.state.query);
    return results;
  };

  render() {
    const modalProps = {
      deleteConfirmHandler: this.deleteConfirmHandler,
      handleModalClose: this.handleModalClose,
      handleModalEdit: this.modalEditHandler,
      showModal: this.state.showModal,
      modalReview: this.state.selectedReview,
      itemName: this.props.itemName || 'Review',
    };
    let { pageHeaderProps, hideFooter } = this.props;

    let filteredReviews = this.fuzzyFilterReviews(this.props.reviews);
    return (
      <SearchableReviewDisplayView
        handleSearch={this.handleSearch}
        reviewClicked={this.reviewClicked}
        query={this.state.query}
        reviews={filteredReviews}
        modalProps={modalProps}
        pageHeaderProps={pageHeaderProps}
        hideFooter={hideFooter}
      />
    );
  }
}

export default SearchableReviewDisplayContainer;

import React, { Component } from 'react';
import ReviewReaderView from '../ReviewReader/ReviewReader-view';

class DraftsContainer extends Component {
  handleSearch = () => {
    console.log('LOL Nope');
  };

  reviewClicked = () => {
    console.log('Forget about it');
  };

  render() {
    const drafts = []; // for now
    return (
      <ReviewReaderView
        handleSearch={this.handleSearch}
        reviewClicked={this.reviewClicked}
        query=""
        reviews={drafts}
        modalProps={null}
      />
    );
  }
}

export default DraftsContainer;

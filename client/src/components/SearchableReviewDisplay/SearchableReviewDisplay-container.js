import React, { useState } from 'react';
import SearchableReviewDisplayView from './SearchableReviewDisplay-view';
import Fuse from 'fuse.js';

const fuzzyFilterReviews = (query, reviews) => {
  if (query === '') {
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
  const results = fuse.search(query);
  return results;
};

export default function SearchableReviewDisplayContainer({
  reviews,
  reviewToOpen,
  itemName,
  pageHeaderProps,
  hideFooter,
  deleteItemFunc,
  handleModalEdit,
  handleModalCopy,
}) {
  const [query, setQuery] = useState('');
  const [selectedReview, setSelectedReview] = useState(reviewToOpen);
  const [showModal, setShowModal] = useState(reviewToOpen);

  const reviewClicked = review => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedReview(null);
    setShowModal(false);
  };

  const deleteConfirmHandler = () => {
    deleteItemFunc(selectedReview);
    setShowModal(false);
  };

  const modalEditHandler = () => {
    handleModalEdit(selectedReview);
  };

  const modalCopyHandler = () => {
    handleModalCopy(selectedReview);
  };

  // render
  const modalProps = {
    deleteConfirmHandler: deleteConfirmHandler,
    handleModalClose: handleModalClose,
    handleModalEdit: modalEditHandler,
    handleModalCopy: handleModalCopy ? modalCopyHandler : null,
    showModal: showModal,
    modalReview: selectedReview,
    itemName: itemName || 'Review',
  };

  let filteredReviews = fuzzyFilterReviews(query, reviews);

  return (
    <SearchableReviewDisplayView
      handleSearch={setQuery}
      reviewClicked={reviewClicked}
      query={query}
      reviews={filteredReviews}
      modalProps={modalProps}
      pageHeaderProps={pageHeaderProps}
      hideFooter={hideFooter}
    />
  );
}

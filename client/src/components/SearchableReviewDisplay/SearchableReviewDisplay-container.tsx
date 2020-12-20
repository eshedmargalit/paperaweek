import React, { useState } from 'react';
import Fuse from 'fuse.js';
import SearchableReviewDisplayView from './SearchableReviewDisplay-view';
import { Maybe, Review } from '../../types';
import { PageHeaderProps } from 'antd/lib/page-header';

const fuzzyFilterReviews = (query: string, reviews: Review[]) => {
  if (query === '') {
    return reviews;
  }
  const options = {
    shouldSort: false,
    threshold: 0.2,
    location: 0,
    distance: 5000,
    maxPatternLength: 32,
    minMatchCharLength: 4,
    keys: ['paper.title', 'paper.authors', 'paper.keywords', 'paper.date'],
  };

  const fuse = new Fuse(reviews, options);
  const results = fuse.search(query);
  return results;
};

interface SearchableReviewDisplayContainerProps {
  reviews: Review[];
  reviewToOpen?: Review;
  renderMath: boolean;
  itemName: string;
  pageHeaderProps: PageHeaderProps;
  hideFooter: boolean;
  deleteItemFunc: (selectedReview: Review) => void;
  handleModalEdit: (selectedReview: Review) => void;
  handleModalCopy?: () => void;
}

export default function SearchableReviewDisplayContainer({
  reviews,
  reviewToOpen,
  renderMath,
  itemName,
  pageHeaderProps,
  hideFooter,
  deleteItemFunc,
  handleModalEdit,
  handleModalCopy,
}: SearchableReviewDisplayContainerProps): JSX.Element {
  const [query, setQuery] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | undefined>(reviewToOpen);
  const [showModal, setShowModal] = useState(reviewToOpen !== null);

  const reviewClicked = (review: Review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedReview(undefined);
    setShowModal(false);
  };

  const deleteConfirmHandler = () => {
    if (selectedReview) {
      deleteItemFunc(selectedReview);
    }
    setShowModal(false);
  };

  const modalEditHandler = () => {
    if (selectedReview) {
      handleModalEdit(selectedReview);
    }
  };

  // render
  const modalProps = {
    deleteConfirmHandler,
    handleModalClose,
    handleModalEdit: modalEditHandler,
    handleModalCopy,
    showModal,
    modalReview: selectedReview,
    renderMath,
    itemName: itemName || 'Review',
  };

  const filteredReviews = fuzzyFilterReviews(query, reviews);

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

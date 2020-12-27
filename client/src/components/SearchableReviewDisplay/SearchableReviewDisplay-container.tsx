import React, { useState } from 'react';
import Fuse from 'fuse.js';
import { PageHeaderProps } from 'antd/lib/page-header';
import SearchableReviewDisplayView from './SearchableReviewDisplay-view';
import { Review } from '../../types';

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
  renderMath?: boolean;
  itemName?: string;
  pageHeaderProps: PageHeaderProps;
  hideFooter: boolean;
  deleteItemFunc?: (selectedReview: Review) => void;
  handleModalEdit?: (selectedReview: Review) => void;
  handleModalCopy?: (selectedReview: Review) => void;
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
    if (selectedReview && deleteItemFunc) {
      deleteItemFunc(selectedReview);
    }
    setShowModal(false);
  };

  const editReviewIfSelected = () => {
    if (selectedReview && handleModalEdit) {
      handleModalEdit(selectedReview);
    }
  };

  const copyReviewIfSelected = () => {
    if (selectedReview && handleModalCopy) {
      handleModalCopy(selectedReview);
    }
  };

  // render
  const modalProps = {
    deleteConfirmHandler,
    handleModalClose,
    handleModalEdit: handleModalEdit && editReviewIfSelected,
    handleModalCopy: handleModalCopy && copyReviewIfSelected,
    showModal,
    modalReview: selectedReview,
    renderMath: renderMath || true,
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

import React, { useState } from 'react';
import Fuse from 'fuse.js';
import { PageHeaderProps } from 'antd/lib/page-header';
import SearchableReviewDisplayView from './SearchableReviewDisplay-view';
import { Notes, Paper, Review } from '../../types';

const fuzzyFilterReviews = (query: string, reviews: Review[]) => {
  if (query === '') {
    return reviews;
  }

  type PaperKey = `paper.${keyof Paper}`;
  type NotesKey = `notes.${keyof Notes}`;

  const keys: (PaperKey | NotesKey)[] = [
    'paper.title',
    'paper.authors',
    'paper.institutions',
    'paper.date',
    'notes.keywords',
    'notes.tldr',
  ];

  const options = {
    shouldSort: false,
    threshold: 0.2,
    location: 0,
    distance: 5000,
    maxPatternLength: 32,
    minMatchCharLength: 4,
    keys,
  };

  const fuse = new Fuse(reviews, options);
  const results = fuse.search(query);
  return results;
};

interface SearchableReviewDisplayContainerProps {
  reviews: Review[];
  reviewToOpen?: Review;
  itemName?: string;
  pageHeaderProps: PageHeaderProps;
  hideButtons: boolean;
  deleteItemFunc?: (selectedReview: Review) => Promise<void>;
  handleModalEdit?: (selectedReview: Review) => void;
  handleModalCopy?: (selectedReview: Review) => void;
}

export default function SearchableReviewDisplayContainer({
  reviews,
  reviewToOpen,
  itemName,
  pageHeaderProps,
  hideButtons,
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

  const deleteConfirmHandler = async () => {
    if (selectedReview && deleteItemFunc) {
      await deleteItemFunc(selectedReview);
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
      hideButtons={hideButtons}
    />
  );
}

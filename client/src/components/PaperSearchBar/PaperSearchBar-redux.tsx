import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setActiveReview } from '../../slices/activeReviewSlice';
import { blankNotes, blankReview } from '../../templates';
import { Paper, Review } from '../../types';
import { useSetReadingList } from '../ReadingList/hooks';
import PaperSearchBarContainer from './PaperSearchBar-container';

export default function PaperSearchBarRedux(): JSX.Element {
  const dispatch = useAppDispatch();
  const readingList = useAppSelector((state) => state.readingList);
  const { setReadingList } = useSetReadingList();
  /**
   * Sets the review in the redux store to be the default "blank" review, overwriting any existing review
   */
  const setBlankReview = (): void => {
    dispatch(setActiveReview(blankReview));
  };

  /**
   * When Add to Reading List is clicked, add the Paper to the reading list, then update in DB and redux store
   */
  const handleReadingListAdd = (paper: Paper): void => {
    const newReadingList = readingList.concat(paper);
    setReadingList(newReadingList);
  };

  /**
   * When start review is clicked, create a new Review with the paper metadata and blank notes. Set the review in the redux store so it's available when we fit the "/form" route
   */
  const handleStartReview = (paper: Paper): void => {
    const review: Review = {
      paper,
      notes: blankNotes,
    };
    dispatch(setActiveReview(review));
  };

  return (
    <PaperSearchBarContainer
      setBlankReview={setBlankReview}
      handleReadingListAdd={handleReadingListAdd}
      handleStartReview={handleStartReview}
    />
  );
}

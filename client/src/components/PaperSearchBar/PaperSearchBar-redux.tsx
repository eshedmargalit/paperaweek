import axios from 'axios';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setActiveReview } from '../../slices/activeReviewSlice';
import { updateReadingList } from '../../slices/readingListSlice';
import { blankNotes, blankReview } from '../../templates';
import { Paper, Review } from '../../types';
import PaperSearchBarContainer from './PaperSearchBar-container';

export default function PaperSearchBarRedux(): JSX.Element {
  const dispatch = useAppDispatch();
  const readingList = useAppSelector((state) => state.readingList);

  /**
   * Sets the review in the redux store to be the default "blank" review, overwriting any existing review
   */
  const setBlankReview = (): void => {
    dispatch(setActiveReview(blankReview));
  };

  /**
   * Updates reading list in redux store, PUTs it in the DB, then updates again using the response from the server (to correct any inconsistencies)
   */
  const updateReadingListFunc = async (newReadingList: Paper[]): Promise<void> => {
    dispatch(updateReadingList(newReadingList));

    await axios.put<Paper[]>('api/readingList', newReadingList);
  };

  /**
   * When Add to Reading List is clicked, add the Paper to the reading list, then update in DB and redux store
   */
  const handleReadingListAdd = (paper: Paper): void => {
    const newReadingList = readingList.concat(paper);
    updateReadingListFunc(newReadingList);
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

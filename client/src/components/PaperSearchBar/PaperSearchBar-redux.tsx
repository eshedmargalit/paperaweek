import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReview, updateReadingList } from '../../actions';
import { RootState } from '../../reducers';
import { blankNotes, blankReview } from '../../templates';
import { Paper, Review } from '../../types';
import PaperSearchBarContainer from './PaperSearchBar-container';

export default function PaperSearchBarRedux(): JSX.Element {
  const dispatch = useDispatch();
  const readingList = useSelector((state: RootState) => state.readingList);

  /**
   * Sets the review in the redux store to be the default "blank" review, overwriting any existing review
   */
  const setBlankReview = () => {
    dispatch(setReview(blankReview));
  };

  /**
   * Updates reading list in redux store, PUTs it in the DB, then updates again using the response from the server (to correct any inconsistencies)
   */
  const updateReadingListFunc = async (newReadingList: Paper[]) => {
    dispatch(updateReadingList(newReadingList));

    const res = await axios.put<Paper[]>('api/readingList', newReadingList);
    if (res.data) {
      dispatch(updateReadingList(res.data));
    }
  };

  /**
   * When Add to Reading List is clicked, add the Paper to the reading list, then update in DB and redux store
   */
  const handleReadingListAdd = (paper: Paper) => {
    const newReadingList = readingList.concat(paper);
    updateReadingListFunc(newReadingList);
  };

  /**
   * When start review is clicked, create a new Review with the paper metadata and blank notes. Set the review in the redux store so it's available when we fit the "/form" route
   */
  const handleStartReview = (paper: Paper) => {
    const review: Review = {
      paper,
      notes: blankNotes,
    };
    dispatch(setReview(review));
  };

  return (
    <PaperSearchBarContainer
      setBlankReview={setBlankReview}
      handleReadingListAdd={handleReadingListAdd}
      handleStartReview={handleStartReview}
    />
  );
}

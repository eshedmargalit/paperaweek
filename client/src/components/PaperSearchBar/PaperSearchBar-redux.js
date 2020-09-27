import axios from 'axios';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setReview, updateReadingList } from '../../actions';
import PaperSearchBarContainer from './PaperSearchBar-container';

export default function PaperSearchBarRedux() {
  const dispatch = useDispatch();
  let readingList = useSelector(state => state.readingList);

  const setBlankReview = () => {
    dispatch(setReview(null, null));
  };

  const updateReadingListFunc = async newReadingList => {
    dispatch(updateReadingList(newReadingList));

    const res = await axios.put('api/readingList', newReadingList);
    dispatch(updateReadingList(res.data));
  };

  const handleClickResult = ({ paper }) => {
    const newReadingList = readingList.concat(paper);
    updateReadingListFunc(newReadingList);
  };

  const handleClickResultButton = ({ paper }) => {
    const reviewContent = {
      paper: paper,
      review: null,
    };
    dispatch(setReview(null, reviewContent));
  };

  return (
    <PaperSearchBarContainer
      setBlankReview={setBlankReview}
      handleClickResult={handleClickResult}
      handleClickResultButton={handleClickResultButton}
    />
  );
}

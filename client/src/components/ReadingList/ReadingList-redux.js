import React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setReview, updateReadingList, updateDraftId } from '../../actions';
import ReadingListContainer from './ReadingList-container';

import arrayMove from 'array-move';

export default function ReadingListRedux() {
  const dispatch = useDispatch();
  const readingList = useSelector(state => state.readingList);

  const updateReadingListFunc = async newReadingList => {
    dispatch(updateReadingList(newReadingList));

    const res = await axios.put('api/readingList', newReadingList);
    dispatch(updateReadingList(res.data));
  };

  const handleEditClick = value => {
    dispatch(updateDraftId(null));
    dispatch(setReview(value._id, null));
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newReadingList = arrayMove(readingList, oldIndex, newIndex);
    updateReadingListFunc(newReadingList);
  };

  const removeFromReadingList = paper => {
    let newReadingList = readingList.filter(currPaper => {
      return currPaper !== paper;
    });
    updateReadingListFunc(newReadingList);
  };

  return (
    <ReadingListContainer
      items={readingList}
      handleEditClick={handleEditClick}
      handleDeleteClick={removeFromReadingList}
      onSortEnd={onSortEnd}
    />
  );
}

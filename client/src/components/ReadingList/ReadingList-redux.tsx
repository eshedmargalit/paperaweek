import React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import arrayMove from 'array-move';
import { setReview, updateReadingList, updateDraftId } from '../../actions';
import ReadingListContainer from './ReadingList-container';
import { RootState } from '../../reducers';
import { Paper, Review } from '../../types';
import { SortEndHandler } from 'react-sortable-hoc';

export default function ReadingListRedux() {
  const dispatch = useDispatch();
  const readingList: Paper[] = useSelector((state: RootState) => state.readingList);

  const updateReadingListFunc = async (newReadingList: Paper[]) => {
    dispatch(updateReadingList(newReadingList));

    const res = await axios.put('api/readingList', newReadingList);
    dispatch(updateReadingList(res.data));
  };

  const handleEditClick = (review: Review) => {
    dispatch(updateDraftId(null));
    dispatch(setReview(review));
  };

  const onSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
    const newReadingList = arrayMove(readingList, oldIndex, newIndex);
    updateReadingListFunc(newReadingList);
  };

  const removeFromReadingList = (paper: Paper) => {
    const newReadingList = readingList.filter(currPaper => currPaper !== paper);
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

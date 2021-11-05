import React from 'react';
import arrayMove from 'array-move';
import { SortEndHandler } from 'react-sortable-hoc';
import ReadingListContainer from './ReadingList-container';
import { Paper, Review } from '../../types';
import { blankNotes } from '../../templates';
import { updateDraftId } from '../../slices/activeDraftSlice';
import { setActiveReview } from '../../slices/activeReviewSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { useUpdateReadingListFunc } from './hooks';

export default function ReadingListRedux(): JSX.Element {
  const dispatch = useAppDispatch();
  const readingList: Paper[] = useAppSelector((state) => state.readingList);
  const { updateReadingListFunc } = useUpdateReadingListFunc();

  const handleEditClick = (paper: Paper) => {
    dispatch(updateDraftId(null));
    const newReview: Review = { paper, notes: blankNotes };
    dispatch(setActiveReview(newReview));
  };

  const onSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
    const newReadingList = arrayMove(readingList, oldIndex, newIndex);
    updateReadingListFunc(newReadingList);
  };

  const removeFromReadingList = (paper: Paper) => {
    const newReadingList = readingList.filter((currPaper) => currPaper !== paper);
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

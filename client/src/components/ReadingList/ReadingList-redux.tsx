import React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import arrayMove from 'array-move';
import { SortEndHandler } from 'react-sortable-hoc';
import { updateReadingList } from '../../actions';
import ReadingListContainer from './ReadingList-container';
import { RootState } from '../../slices';
import { Paper, Review } from '../../types';
import { blankNotes } from '../../templates';
import { updateDraftId } from '../../slices/activeDraftSlice';
import { setActiveReview } from '../../slices/activeReviewSlice';

export default function ReadingListRedux(): JSX.Element {
  const dispatch = useDispatch();
  const readingList: Paper[] = useSelector((state: RootState) => state.readingList);
  const { demoMode } = useSelector((state: RootState) => state.auth);

  const updateReadingListFunc = async (newReadingList: Paper[]) => {
    dispatch(updateReadingList(newReadingList));

    // If we're in demoMode, don't attempt to update the server...
    if (demoMode) {
      return;
    }
    const { data } = await axios.put<Paper[]>('api/readingList', newReadingList);
    dispatch(updateReadingList(data));
  };

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

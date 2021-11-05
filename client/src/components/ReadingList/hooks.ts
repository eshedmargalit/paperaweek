import axios from 'axios';
import { Paper } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { updateReadingList } from '../../slices/readingListSlice';
import { constructPaperFromResponse, PaperResponse } from '../../dtos';

interface returnProps {
  updateReadingListFunc: (newReadingList: Paper[]) => Promise<void>;
}

export const useUpdateReadingListFunc = (): returnProps => {
  const dispatch = useAppDispatch();
  const { demoMode } = useAppSelector((state) => state.auth);

  const updateReadingListFunc = async (newReadingList: Paper[]) => {
    dispatch(updateReadingList(newReadingList));

    // If we're in demoMode, don't attempt to update the server...
    if (demoMode) {
      return;
    }
    const { data } = await axios.put<PaperResponse[]>('api/readingList', newReadingList);
    if (data) {
      dispatch(updateReadingList(data.map(constructPaperFromResponse)));
    }
  };
  return { updateReadingListFunc };
};

import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cloneDeep as _cloneDeep } from 'lodash';
import { fetchUser } from '../../actions';
import { Review } from '../../types';
import SearchableReviewDisplay from '../SearchableReviewDisplay';
import { updateDraftId } from '../../slices/activeDraftSlice';
import { setActiveReview } from '../../slices/activeReviewSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';

export default function DraftsRedux(): JSX.Element {
  const dispatch = useAppDispatch();
  const drafts: Review[] = useAppSelector((state) => state.drafts);
  const navigate = useNavigate();

  // function to delete the specified draft
  const deleteDraft = async (draftToDelete: Review) => {
    await axios.delete(`/api/drafts/${draftToDelete._id}`);
    dispatch(fetchUser());
  };

  // function to edit the specified draft
  const handleModalEdit = (draft: Review) => {
    // a draft should always have an ID if we got to it through this view
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    dispatch(updateDraftId(draft._id!));
    const clone = _cloneDeep(draft);
    delete clone._id;
    dispatch(setActiveReview(clone));
  };

  const pageHeaderProps = {
    title: 'Your Drafts',
    onBack: () => navigate(-1),
  };

  return (
    <SearchableReviewDisplay
      reviews={drafts}
      deleteItemFunc={deleteDraft}
      handleModalEdit={handleModalEdit}
      pageHeaderProps={pageHeaderProps}
      itemName="Draft"
    />
  );
}

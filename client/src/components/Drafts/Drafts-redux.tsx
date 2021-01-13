import axios from 'axios';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setReview, updateDraftId, updateDrafts } from '../../actions';
import { RootState } from '../../reducers';
import { Review } from '../../types';
import SearchableReviewDisplay from '../SearchableReviewDisplay';

export default function DraftsRedux(): JSX.Element {
  const dispatch = useDispatch();
  const drafts: Review[] = useSelector((state: RootState) => state.drafts);
  const { goBack } = useHistory();

  // function to delete the specified draft
  const deleteDraft = (draftToDelete: Review) => {
    const newDrafts = drafts.filter(draft => draft !== draftToDelete);
    dispatch(updateDrafts(newDrafts));

    axios.delete(`/api/drafts/${draftToDelete._id}`);
  };

  // function to edit the specified draft
  const handleModalEdit = (draft: Review) => {
    // a draft should always have an ID if we got to it through this view
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    dispatch(updateDraftId(draft._id!));
    dispatch(setReview(draft));
  };

  const pageHeaderProps = {
    title: 'Your Drafts',
    onBack: goBack,
  };

  return (
    <SearchableReviewDisplay
      reviews={drafts}
      deleteItemFunc={deleteDraft}
      handleModalEdit={handleModalEdit}
      pageHeaderProps={pageHeaderProps}
      itemName="Draft"
      hideFooter={false}
    />
  );
}

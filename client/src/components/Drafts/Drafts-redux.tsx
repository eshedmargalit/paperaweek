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
  const renderMath: boolean = useSelector((state: RootState) => state.user.renderMath);
  const { goBack } = useHistory();

  // function to delete the specified draft
  const deleteDraft = (draftToDelete: Review) => {
    const newDrafts = drafts.filter(draft => draft !== draftToDelete);
    dispatch(updateDrafts(newDrafts));

    axios.delete(`/api/drafts/${draftToDelete._id}`);
  };

  // function to edit the specified draft
  const handleModalEdit = (draft: Review) => {
    dispatch(updateDraftId(draft._id || null));
    dispatch(setReview(draft));
  };

  const pageHeaderProps = {
    title: 'Your Drafts',
    onBack: goBack,
  };

  return (
    <SearchableReviewDisplay
      reviews={drafts}
      renderMath={renderMath}
      deleteItemFunc={deleteDraft}
      handleModalEdit={handleModalEdit}
      pageHeaderProps={pageHeaderProps}
      itemName="Draft"
      hideFooter={false}
    />
  );
}

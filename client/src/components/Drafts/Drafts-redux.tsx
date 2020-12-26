import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setReview, updateDraftId, updateDrafts, fetchUser } from '../../actions';
import { RootState } from '../../reducers';
import { Review } from '../../types';
import SearchableReviewDisplay from '../SearchableReviewDisplay';

export default function DraftsRedux(): JSX.Element {
  const dispatch = useDispatch();
  const drafts: Review[] = useSelector((state: RootState) => state.drafts);
  const renderMath: boolean = useSelector((state: RootState) => state.user.renderMath);
  const [redirectHome, setRedirectHome] = useState(false);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // go home if back arrow is pressed
  if (redirectHome) {
    return <Redirect to="/dashboard" push />;
  }

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
    title: 'Read Your Drafts',
    onBack: () => setRedirectHome(true),
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

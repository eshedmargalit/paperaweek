import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setReview, updateDraftId, updateDrafts, fetchUser } from '../../actions';
import SearchableReviewDisplay from '../SearchableReviewDisplay';

export default function DraftsRedux() {
  const dispatch = useDispatch();
  const drafts = useSelector(state => state.drafts);
  const renderMath = useSelector(state => state.user.renderMath);
  const [redirectHome, setRedirectHome] = useState(false);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // go home if back arrow is pressed
  if (redirectHome) {
    return <Redirect to="/dashboard" push />;
  }

  // function to delete the specified draft
  const deleteDraft = draftToDelete => {
    const newDrafts = drafts.filter(draft => {
      return draft !== draftToDelete;
    });
    dispatch(updateDrafts(newDrafts));

    axios.delete(`/api/drafts/${draftToDelete._id}`);
  };

  // function to edit the specified draft
  const handleModalEdit = draft => {
    const draftId = draft._id;
    const draftContent = {
      paper: draft.paper,
      review: draft.review,
    };
    dispatch(updateDraftId(draftId));
    dispatch(setReview(null, draftContent));
  };

  const pageHeaderProps = {
    pageHeaderTitle: 'Read Your Drafts',
    onPageBack: () => setRedirectHome(true),
  };

  return (
    <SearchableReviewDisplay
      reviews={drafts}
      reviewToOpen={null}
      renderMath={renderMath}
      deleteItemFunc={deleteDraft}
      handleModalEdit={handleModalEdit}
      handleModalCopy={null}
      pageHeaderProps={pageHeaderProps}
      itemName="Draft"
    />
  );
}

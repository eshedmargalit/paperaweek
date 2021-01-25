import axios from 'axios';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { cloneDeep as _cloneDeep } from 'lodash';
import { fetchUser, setReview, updateDraftId } from '../../actions';
import { RootState } from '../../reducers';
import { Review } from '../../types';
import SearchableReviewDisplay from '../SearchableReviewDisplay';

export default function DraftsRedux(): JSX.Element {
  const dispatch = useDispatch();
  const drafts: Review[] = useSelector((state: RootState) => state.drafts);
  const { goBack } = useHistory();

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
    dispatch(setReview(clone));
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

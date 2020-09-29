import { useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const statuses = {
  UNSAVED: 'unsaved',
  SAVING: 'saving',
  SAVED: 'saved',
  SAVE_FAILED: 'saveFailed',
};

// do not export
const draftSaver = (paper, review, draftId) => {
  const draftToSave = { paper, review };

  const method = draftId ? 'put' : 'post';
  const url = '/api/drafts';
  const data = {
    draft: draftToSave,
    id: draftId,
  };

  return axios({ method, url, data });
};

export const useSaveDraft = () => {
  const [draftId, setDraftId] = useState(null);
  const [lastSave, setLastSave] = useState(null);
  const [autosaveStatus, setAutosaveStatus] = useState(statuses.UNSAVED);

  console.log(`Draft ID in useSaveDraft() is ${draftId}`);
  const saveDraft = async (paper, review) => {
    console.log(`Draft ID in saveDraft() is ${draftId}`);
    setAutosaveStatus(statuses.SAVING);
    const res = await draftSaver(paper, review, draftId);
    if (res.status === 200) {
      setAutosaveStatus(statuses.SAVED);
      setLastSave(moment());
      setDraftId(res.data._id);
    } else {
      setAutosaveStatus(statuses.SAVE_FAILED);
      setLastSave(null);
    }
  };

  return { autosaveStatus, lastSave, saveDraft };
};

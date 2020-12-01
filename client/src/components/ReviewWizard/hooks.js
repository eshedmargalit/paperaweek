import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useIsMounted } from '../../hooks';
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
  const isMounted = useIsMounted();

  const activeDraftId = useSelector(state => state.activeDraft.draftId);
  const [draftId, setDraftId] = useState(activeDraftId);
  const [lastSave, setLastSave] = useState(null);
  const [autosaveStatus, setAutosaveStatus] = useState(statuses.UNSAVED);

  const draftIdRef = useRef();

  useEffect(() => {
    draftIdRef.current = draftId;
  }, [draftId]);

  // saveDraft function
  const saveDraft = async (paper, review) => {
    if (isMounted()) {
      setAutosaveStatus(statuses.SAVING);
      const res = await draftSaver(paper, review, draftIdRef.current);
      if (res.status === 200) {
        setAutosaveStatus(statuses.SAVED);
        setLastSave(moment());
        setDraftId(res.data._id);
      } else {
        setAutosaveStatus(statuses.SAVE_FAILED);
        setLastSave(null);
      }
    }
  };

  // deleteActiveDraft function
  const deleteActiveDraft = async () => {
    if (isMounted() && draftIdRef.current) {
      await axios.delete(`api/drafts/${draftIdRef.current}`);
    }
  };

  return { autosaveStatus, lastSave, saveDraft, deleteActiveDraft };
};

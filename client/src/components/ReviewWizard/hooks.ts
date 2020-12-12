import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment, { Moment } from 'moment';
import { useIsMounted } from '../../hooks';
import { Maybe, MongoID, Notes, Paper } from '../../types';
import { RootState } from '../../reducers';

const statuses = {
  UNSAVED: 'unsaved',
  SAVING: 'saving',
  SAVED: 'saved',
  SAVE_FAILED: 'saveFailed',
};

// do not export
const draftSaver = (paper: Paper, notes: Notes, draftId: Maybe<MongoID>) => {
  const draftToSave = { paper, notes };

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

  const activeDraft = useSelector((state: RootState) => state.activeDraft);
  const [draftId, setDraftId] = useState(activeDraft);
  const [lastSave, setLastSave] = useState<Maybe<Moment>>(null);
  const [autosaveStatus, setAutosaveStatus] = useState(statuses.UNSAVED);

  const draftIdRef = useRef<Maybe<MongoID>>();

  useEffect(() => {
    draftIdRef.current = draftId;
  }, [draftId]);

  // saveDraft function
  const saveDraft = async (paper: Paper, notes: Notes) => {
    if (isMounted()) {
      setAutosaveStatus(statuses.SAVING);
      const res = await draftSaver(paper, notes, draftIdRef.current || null);
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

  return {
    autosaveStatus,
    lastSave,
    saveDraft,
    deleteActiveDraft,
  };
};

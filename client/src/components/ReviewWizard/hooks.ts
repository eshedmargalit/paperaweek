import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment, { Moment } from 'moment';
import { useIsMounted } from '../../hooks';
import { Maybe, MongoID, Notes, Paper, Review } from '../../types';
import { RootState } from '../../reducers';

const statuses = {
  UNSAVED: 'unsaved',
  SAVING: 'saving',
  SAVED: 'saved',
  SAVE_FAILED: 'saveFailed',
};

// do not export
const saveDraftToDB = (paper: Paper, notes: Notes, draftId: Maybe<MongoID>) => {
  const draftToSave: Review = { paper, notes };

  const method = draftId ? 'put' : 'post';
  const url = '/api/drafts';
  const data = {
    draft: draftToSave,
    id: draftId,
  };

  return axios({ method, url, data });
};

interface returnProps {
  autosaveStatus: string;
  lastSave: Maybe<Moment>;
  saveDraft: (paper: Paper, notes: Notes) => Promise<void>;
  deleteActiveDraft: () => void;
}
export const useSaveDraft = (): returnProps => {
  const isMounted = useIsMounted();

  const activeDraft = useSelector((state: RootState) => state.activeDraft);
  const [draftId, setDraftId] = useState(activeDraft);
  const [lastSave, setLastSave] = useState<Maybe<Moment>>(null);
  const [autosaveStatus, setAutosaveStatus] = useState(statuses.UNSAVED);

  /**
   * The inner function `saveDraft` is frozen on the first invocation of this function, so even if draftId changes in the parent function, that change doesn't cause saveDraft to use the new value of draftId. If you use a ref, they stay synchronized
   */
  const draftIdRef = useRef<Maybe<MongoID>>();

  useEffect(() => {
    draftIdRef.current = draftId;
  }, [draftId]);

  // saveDraft function
  const saveDraft = async (paper: Paper, notes: Notes) => {
    if (isMounted()) {
      setAutosaveStatus(statuses.SAVING);
      const res = await saveDraftToDB(paper, notes, draftIdRef.current || null);
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

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import moment, { Moment } from 'moment';
import { isEqual as _isEqual } from 'lodash';
import * as Yup from 'yup';
import { Resolver } from 'react-hook-form';
import { useIsMounted } from '../../hooks';
import { Maybe, MongoID, Review } from '../../types';
import { RootState } from '../../reducers';
import { fetchUser } from '../../actions';
import { blankReview } from '../../templates';
import { FormReview } from './types';

const statuses = {
  UNSAVED: 'unsaved',
  SAVING: 'saving',
  SAVED: 'saved',
  SAVE_FAILED: 'saveFailed',
};

// do not export
const saveDraftToDB = (draft: Review, draftId: Maybe<MongoID>) => {
  const method = draftId ? 'put' : 'post';
  const url = '/api/drafts';
  const data = {
    draft,
    id: draftId,
  };

  return axios({ method, url, data });
};

interface returnProps {
  autosaveStatus: string;
  lastSave: Maybe<Moment>;
  saveDraft: (draft: Review) => Promise<void>;
  deleteActiveDraft: () => Promise<void>;
}
export const useSaveDraft = (): returnProps => {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();

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
  const saveDraft = async (draft: Review) => {
    if (_isEqual(draft, blankReview)) {
      return;
    }

    if (isMounted()) {
      setAutosaveStatus(statuses.SAVING);
      const res = await saveDraftToDB(draft, draftIdRef.current || null);
      if (res.status === 200) {
        setAutosaveStatus(statuses.SAVED);
        setLastSave(moment());
        setDraftId(res.data._id);
        dispatch(fetchUser());
      } else {
        setAutosaveStatus(statuses.SAVE_FAILED);
        setLastSave(null);
      }
    }
  };

  // deleteActiveDraft function
  const deleteActiveDraft = async () => {
    if (draftIdRef.current) {
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

// From https://react-hook-form.com/advanced-usage#CustomHookwithResolver
export const useYupValidationResolver = (validationSchema: Yup.AnyObjectSchema): Resolver<FormReview> =>
  useCallback(
    async data => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });
        console.log(values);

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors: any, currentError: any) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
    [validationSchema]
  );

import { useEffect } from 'react';
import { Review } from '../../types';

interface DraftSaverProps {
  values: Review;
  saveFn: (values: Review) => void;
  converter: (values: Review) => Review;
}

/**
 * DraftSaver is a special component which is always rendered in a <Formik> context
 * It is meant to save drafts whenever values change
 */
export function DraftSaver({ values, converter, saveFn }: DraftSaverProps): null {
  useEffect(() => {
    saveFn(converter(values));
  }, [values]);

  return null;
}

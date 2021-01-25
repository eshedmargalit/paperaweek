import { createContext } from 'react';
import { Maybe, Review } from '../types';

type DraftSaver = (draft: Review) => void;

const DraftsContext = createContext<Maybe<DraftSaver>>(null);

export default DraftsContext;

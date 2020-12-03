import { UPDATE_DRAFT_ID } from '../actions/actionTypes';
import { UpdateDraftIdAction } from '../actions/types';
import { Maybe, MongoID } from '../types';

const initialState: Maybe<MongoID> = null;

const reducer = (state = initialState, action: UpdateDraftIdAction) => {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_DRAFT_ID:
      return payload;
    default:
      return state;
  }
};

export default reducer;

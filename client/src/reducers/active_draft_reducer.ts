import { UPDATE_DRAFT_ID } from '../actions/actionTypes';
import { UpdateDraftIdAction } from '../actions/types';

const initialState = {
  draftId: null,
};

const reducer = (state = initialState, action: UpdateDraftIdAction) => {
  let { type, payload } = action;
  switch (type) {
    case UPDATE_DRAFT_ID:
      return payload;
    default:
      return state;
  }
};

export default reducer;

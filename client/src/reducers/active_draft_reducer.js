import { UPDATE_DRAFT_ID } from '../actions/index';

const initialState = {
  draftId: null,
};

const reducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case UPDATE_DRAFT_ID:
      return { ...payload };
    default:
      return state;
  }
};

export default reducer;

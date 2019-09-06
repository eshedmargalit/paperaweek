import { combineReducers } from "redux";
import ReducerReviewForm from "./reducer_review_form";

const rootReducer = combineReducers({
  review: ReducerReviewForm
});

export default rootReducer;

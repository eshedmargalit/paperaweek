import { combineReducers } from "redux";
import ReducerReviewForm from "./reducer_review_form";

const rootReducer = combineReducers({
  review_data: ReducerReviewForm
});

export default rootReducer;

export const START_REVIEW = "START_REVIEW";
export const EXIT_FORM = "EXIT_FORM";

export function start_review(review) {
  return {
    type: START_REVIEW,
    review
  };
}

export function exit_form() {
  return {
    type: EXIT_FORM
  };
}

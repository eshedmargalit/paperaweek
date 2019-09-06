export const START_REVIEW = "START_REVIEW";
export const EXIT_FORM = "EXIT_FORM";

export function start_review(paper_metadata) {
  return {
    type: START_REVIEW,
    metadata: paper_metadata
  };
}

export function exit_form() {
  return {
    type: EXIT_FORM
  };
}

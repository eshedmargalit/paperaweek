export function getMetaFields() {
  const meta_fields = [
    {
      fieldName: "title",
      label: "Paper Title",
      required: true,
      list: false
    },
    {
      fieldName: "authors",
      label: "Author Names",
      required: true,
      list: true
    },
    {
      fieldName: "institutions",
      label: "Institution Names",
      required: true,
      list: true
    },
    {
      fieldName: "journal",
      label: "Journal",
      required: true,
      list: false
    },
    {
      fieldName: "doi",
      label: "DOI",
      required: true,
      list: false
    },
    {
      fieldName: "url",
      label: "URL",
      required: true,
      list: false
    },
    {
      fieldName: "date",
      label: "Publication Month",
      required: true,
      list: false
    },
    {
      fieldName: "one_sentence",
      label: "One Sentence Summary",
      required: true,
      list: false
    },
    {
      fieldName: "keywords",
      label: "Keywords (separate with commas)",
      required: false,
      list: false
    }
  ];
  return meta_fields;
}

export function getReviewFields() {
  const review_fields = [
    {
      fieldName: "summary_points",
      label: "Paper Summary",
      required: true,
      list: true
    },
    {
      fieldName: "background_points",
      label: "Background Info",
      required: true,
      list: true
    },
    {
      fieldName: "approach_points",
      label: "Approach",
      required: true,
      list: true
    },
    {
      fieldName: "results_points",
      label: "Results",
      required: true,
      list: true
    },
    {
      fieldName: "conclusions_points",
      label: "Conclusions",
      required: true,
      list: true
    },
    {
      fieldName: "other_points",
      label: "Other (optional)",
      required: false,
      list: true
    }
  ];
  return review_fields;
}

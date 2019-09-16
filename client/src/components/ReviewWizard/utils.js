export function getMetaFields() {
  const meta_fields = [
    {
      fieldName: "title",
      label: "Paper Title",
      required: true,
      isList: false
    },
    {
      fieldName: "authors",
      label: "Author Names",
      required: true,
      isList: true
    },
    {
      fieldName: "institutions",
      label: "Institution Names",
      required: true,
      isList: true
    },
    {
      fieldName: "journal",
      label: "Journal",
      required: true,
      isList: false
    },
    {
      fieldName: "doi",
      label: "DOI",
      required: false,
      isList: false
    },
    {
      fieldName: "url",
      label: "URL",
      required: true,
      isList: false
    },
    {
      fieldName: "date",
      label: "Publication Month",
      required: true,
      isList: false
    },
    {
      fieldName: "one_sentence",
      label: "One Sentence Summary",
      required: true,
      isList: false
    },
    {
      fieldName: "keywords",
      label: "Keywords (separate with commas)",
      required: false,
      isList: false
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
      isList: true
    },
    {
      fieldName: "background_points",
      label: "Background Info",
      required: true,
      isList: true
    },
    {
      fieldName: "approach_points",
      label: "Approach",
      required: true,
      isList: true
    },
    {
      fieldName: "results_points",
      label: "Results",
      required: true,
      isList: true
    },
    {
      fieldName: "conclusions_points",
      label: "Conclusions",
      required: true,
      isList: true
    },
    {
      fieldName: "other_points",
      label: "Other (optional)",
      required: false,
      isList: true
    }
  ];
  return review_fields;
}

export function notEmpty(x) {
  let empty = true;
  if (Array.isArray(x)) {
    x.forEach(item => {
      if (item !== "") {
        empty = false;
      }
    });
  } else {
    if (x !== "") {
      empty = false;
    }
  }
  return !empty;
}

export function getFormItemLayout() {
  const formItemLayout = {
    labelCol: {
      xs: { span: 4 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  };
  return formItemLayout;
}

export function getFormItemLayoutWithOutLabel() {
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 18, offset: 6 }
    }
  };
  return formItemLayoutWithOutLabel;
}

export const metaFields = [
  {
    fieldName: 'title',
    label: 'Paper Title',
    required: true,
    isList: false,
  },
  {
    fieldName: 'authors',
    label: 'Author Names',
    required: true,
    isList: true,
  },
  {
    fieldName: 'institutions',
    label: 'Institution Names',
    required: true,
    isList: true,
  },
  {
    fieldName: 'journal',
    label: 'Journal',
    required: true,
    isList: false,
  },
  {
    fieldName: 'doi',
    label: 'DOI',
    required: false,
    isList: false,
  },
  {
    fieldName: 'url',
    label: 'URL',
    required: false,
    isList: false,
  },
  {
    fieldName: 'date',
    label: 'Publication Month',
    required: true,
    isList: false,
  },
  {
    fieldName: 'one_sentence',
    label: 'One Sentence Summary',
    required: false,
    isList: false,
  },
  {
    fieldName: 'keywords',
    label: 'Keywords (separate with commas)',
    required: false,
    isList: false,
  },
];

export const reviewFields = [
  {
    fieldName: 'background_points',
    label: 'Background Info',
    required: false,
    isList: true,
  },
  {
    fieldName: 'methods_points',
    label: 'Methods',
    required: false,
    isList: true,
  },
  {
    fieldName: 'results_points',
    label: 'Results',
    required: false,
    isList: true,
  },
  {
    fieldName: 'conclusions_points',
    label: 'Conclusions',
    required: false,
    isList: true,
  },
  {
    fieldName: 'other_points',
    label: 'Other',
    required: false,
    isList: true,
  },
];

export function notEmpty(x) {
  let empty = true;
  if (Array.isArray(x)) {
    x.forEach(item => {
      if (item !== '') {
        empty = false;
      }
    });
  } else {
    if (x !== '') {
      empty = false;
    }
  }
  return !empty;
}

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

export const formItemLayoutWithoutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
  },
};

export const blankPaper = {
  title: '',
  author_names: [''],
  institution_names: [''],
  date: new Date(),
  doi: '',
  journal: '',
  url: '',
  keywords: [],
  one_sentence: '',
};

export const blankReview = {
  summary_points: [''],
  background_points: [''],
  approach_points: [''],
  results_points: [''],
  conclusions_points: [''],
  other_points: [''],
};

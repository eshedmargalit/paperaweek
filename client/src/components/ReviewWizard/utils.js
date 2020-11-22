export const reviewFields = [
  {
    fieldName: 'background_points',
    label: 'Background Info',
  },
  {
    fieldName: 'approach_points',
    label: 'Approach',
  },
  {
    fieldName: 'results_points',
    label: 'Results',
  },
  {
    fieldName: 'conclusions_points',
    label: 'Conclusions',
  },
  {
    fieldName: 'other_points',
    label: 'Other',
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

export const blankPaper = {
  title: '',
  authors: [''],
  institutions: [''],
  date: new Date(),
  doi: '',
  journal: '',
  url: '',
  keywords: '',
  one_sentence: '',
};

export const blankReview = {
  background_points: [''],
  approach_points: [''],
  results_points: [''],
  conclusions_points: [''],
  other_points: [''],
};

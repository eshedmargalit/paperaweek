import { SaveFilled, SaveTwoTone } from '@ant-design/icons';
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
    fieldName: 'summary_points',
    label: 'Paper Summary',
    required: false,
    isList: true,
  },
  {
    fieldName: 'background_points',
    label: 'Background Info',
    required: false,
    isList: true,
  },
  {
    fieldName: 'approach_points',
    label: 'Approach',
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
    label: 'Other (optional)',
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
    xs: { span: 4 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

export const formItemLayoutWithoutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 18, offset: 6 },
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
};

export const blankReview = {
  summary_points: [''],
  background_points: [''],
  approach_points: [''],
  results_points: [''],
  conclusions_points: [''],
  other_points: [''],
};

export const draftTimeIndicator = (autosaveStatus, currentMoment, lastSave) => {
  let autosaveIcon;
  switch (autosaveStatus) {
    case 'unsaved':
      autosaveIcon = null;
      break;
    case 'saved':
      let secSinceSave = 0;
      let minSinceSave = 0;
      if (currentMoment) {
        secSinceSave = currentMoment.diff(lastSave, 'seconds');
        minSinceSave = currentMoment.diff(lastSave, 'minutes');
      }

      let timePassedText = '';
      if (secSinceSave <= 0) {
        timePassedText = 'just now';
      } else if (minSinceSave < 1) {
        timePassedText = `${secSinceSave} seconds ago`;
      } else if (minSinceSave === 1) {
        timePassedText = '1 minute ago';
      } else if (minSinceSave > 60) {
        timePassedText = 'more than an hour ago';
      } else {
        timePassedText = `${minSinceSave} minutes ago`;
      }

      autosaveIcon = (
        <div key="autosave" className="save-icon">
          <SaveFilled />
          {` `}Saved to Drafts {timePassedText}
        </div>
      );
      break;
    case 'saving':
      autosaveIcon = (
        <div key="autosave" className="save-icon">
          <SaveTwoTone spin />
          {` `}Saving...
        </div>
      );
      break;
    case 'saveFailed':
      autosaveIcon = (
        <div key="autosave" className="save-icon">
          <SaveTwoTone twoToneColor="#f5222d" />
          {` `} Failed to save
        </div>
      );
      break;
    default:
    // do nothing
  }
  return autosaveIcon;
};

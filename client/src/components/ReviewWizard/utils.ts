import { uniq as _uniq } from 'lodash';
import { Review } from '../../types';
import { StringObj, FormReview } from './types';

type BulletNoteField = 'overview' | 'background' | 'methods' | 'results' | 'conclusions' | 'other';

interface BulletNoteFieldConfig {
  fieldName: BulletNoteField;
  label: string;
  tooltip: string;
}

export const bulletNoteFields: BulletNoteFieldConfig[] = [
  {
    fieldName: 'overview',
    label: 'Overview',
    tooltip: 'What was your impression of the paper? What are its broader implications? What are the key takeaways?',
  },
  {
    fieldName: 'background',
    label: 'Background',
    tooltip:
      'What information would you need to make sense of the methods and results? What gap in knowledge does this paper fill?',
  },
  {
    fieldName: 'methods',
    label: 'Methods',
    tooltip:
      'Describe the approach taken by the authors, including experimental protocols, statistical approaches, or survey methodology.',
  },
  {
    fieldName: 'results',
    label: 'Results',
    tooltip:
      'What core results does this paper present? If its an opinion piece or review paper, what are the perspectives it offers?',
  },
  {
    fieldName: 'conclusions',
    label: 'Conclusions',
    tooltip:
      'What do the authors conclude as a result of this paper? How would they suggest these findings be interpreted?',
  },
  {
    fieldName: 'other',
    label: 'Other',
    tooltip:
      'Use this section to note other relevant points. Examples include flagging a personal connection to the work, mentioning points of confusion, or linking to related papers',
  },
];

export const splitKeywordsIntoArray = (keywords: string | string[]): string[] => {
  if (Array.isArray(keywords)) {
    return keywords;
  }

  return _uniq(
    keywords.split(',').map(item => {
      return item.trim().toLowerCase();
    })
  );
};

const objectArrayToStringArray = (arr: StringObj[]): string[] => arr.map(s => s.contents);
const stringArrayToObjectArray = (arr: string[]): StringObj[] => arr.map(s => ({ contents: s }));

export const convertFormValuesToReview = (review: FormReview): Review => ({
  ...review,
  paper: {
    ...review.paper,
    authors: objectArrayToStringArray(review.paper.authors),
    institutions: objectArrayToStringArray(review.paper.institutions),
  },
  notes: {
    ...review.notes,
    overview: objectArrayToStringArray(review.notes.overview),
    background: objectArrayToStringArray(review.notes.background),
    methods: objectArrayToStringArray(review.notes.methods),
    results: objectArrayToStringArray(review.notes.results),
    conclusions: objectArrayToStringArray(review.notes.conclusions),
    other: objectArrayToStringArray(review.notes.other),
    keywords: splitKeywordsIntoArray(review.notes.keywords),
  },
});

export const convertReviewToFormValues = (review: Review): FormReview => ({
  ...review,
  notes: {
    ...review.notes,
    overview: stringArrayToObjectArray(review.notes.overview),
    background: stringArrayToObjectArray(review.notes.background),
    methods: stringArrayToObjectArray(review.notes.methods),
    results: stringArrayToObjectArray(review.notes.results),
    conclusions: stringArrayToObjectArray(review.notes.conclusions),
    other: stringArrayToObjectArray(review.notes.other),
  },
  paper: {
    ...review.paper,
    authors: stringArrayToObjectArray(review.paper.authors),
    institutions: stringArrayToObjectArray(review.paper.institutions),
  },
});

type ReviewFieldKey = 'background_points' | 'approach_points' | 'results_points' | 'conclusions_points' | 'summary_points' | 'other_points';

interface ReviewFieldConfig { fieldName: ReviewFieldKey; label: string; }

export const reviewFields: ReviewFieldConfig[] = [
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
    fieldName: 'summary_points',
    label: 'Summary',
  },
  {
    fieldName: 'other_points',
    label: 'Other',
  },
];

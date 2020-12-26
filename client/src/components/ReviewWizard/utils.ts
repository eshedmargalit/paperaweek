type BulletNoteField = 'overview' | 'background' | 'methods' | 'results' | 'conclusions' | 'other';

interface BulletNoteFieldConfig {
  fieldName: BulletNoteField;
  label: string;
}

export const bulletNoteFields: BulletNoteFieldConfig[] = [
  {
    fieldName: 'overview',
    label: 'Background Info',
  },
  {
    fieldName: 'background',
    label: 'Approach',
  },
  {
    fieldName: 'methods',
    label: 'Results',
  },
  {
    fieldName: 'results',
    label: 'Conclusions',
  },
  {
    fieldName: 'conclusions',
    label: 'Summary',
  },
  {
    fieldName: 'other',
    label: 'Other',
  },
];

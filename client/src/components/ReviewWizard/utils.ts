type BulletNoteField = 'overview' | 'background' | 'methods' | 'results' | 'conclusions' | 'other';

interface BulletNoteFieldConfig {
  fieldName: BulletNoteField;
  label: string;
}

export const bulletNoteFields: BulletNoteFieldConfig[] = [
  {
    fieldName: 'overview',
    label: 'Overview',
  },
  {
    fieldName: 'background',
    label: 'Background',
  },
  {
    fieldName: 'methods',
    label: 'Methods',
  },
  {
    fieldName: 'results',
    label: 'Results',
  },
  {
    fieldName: 'conclusions',
    label: 'Conclusions',
  },
  {
    fieldName: 'other',
    label: 'Other',
  },
];

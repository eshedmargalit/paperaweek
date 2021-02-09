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

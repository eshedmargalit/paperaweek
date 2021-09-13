import React from 'react';
import { Alert } from 'antd';
import { stringArrayHasNonEmpty, stringNotEmpty, wrapMarkdownWithMath } from '../utils';
import PaperTable from './PaperTable';
import { Review } from '../../types';

interface ReviewDisplayProps {
  review: Review;
  showTitle: boolean;
}

const fields = [
  {
    heading: 'Overview',
    notesKey: 'overview',
  },
  {
    heading: 'Background',
    notesKey: 'background',
  },
  {
    heading: 'Methods',
    notesKey: 'methods',
  },
  {
    heading: 'Results',
    notesKey: 'results',
  },
  {
    heading: 'Conclusions',
    notesKey: 'conclusions',
  },
  {
    heading: 'Other Information',
    notesKey: 'other',
  },
] as const;

export default function ReviewDisplay({ review, showTitle }: ReviewDisplayProps): JSX.Element {
  const { paper, notes } = review;

  const reviewBody = fields.map((field) => {
    const nonEmpty = stringArrayHasNonEmpty(notes[field.notesKey]);
    const toRender = (
      <div key={field.heading}>
        <h6>{field.heading}</h6>
        <ul>
          {notes[field.notesKey].map((point: string) => {
            return <li key={point}>{wrapMarkdownWithMath(point)}</li>;
          })}
        </ul>
      </div>
    );
    return nonEmpty ? toRender : null;
  });

  const tldr = stringNotEmpty(notes.tldr) ? (
    <Alert type="info" message="TLDR" description={notes.tldr} showIcon />
  ) : null;

  return (
    <div>
      {showTitle && <h5>{paper.title}</h5>}
      <PaperTable paper={paper} keywords={notes.keywords} />
      <br />
      {tldr}
      <hr />
      {reviewBody}
    </div>
  );
}

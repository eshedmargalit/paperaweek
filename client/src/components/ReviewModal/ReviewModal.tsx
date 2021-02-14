import React from 'react';
import { Alert, Modal } from 'antd';
import { wrapMarkdownWithMath } from '../utils';
import { Maybe, Review } from '../../types';
import PaperTable from './PaperTable';

export interface ReviewModalProps {
  review: Review;
  visible: boolean;
  onClose: VoidFunction;
  footer: Maybe<JSX.Element[]>;
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

export default function ReviewModal(props: ReviewModalProps): JSX.Element {
  const { paper, notes } = props.review;

  const reviewBody = fields.map(field => {
    const nonEmpty = notes[field.notesKey].some(s => s !== '');
    const toRender = (
      <div key={field.heading}>
        <strong>{field.heading}</strong>
        <ul>
          {notes[field.notesKey].map((point: string) => {
            return <li key={point}>{wrapMarkdownWithMath(point)}</li>;
          })}
        </ul>
      </div>
    );

    return nonEmpty ? toRender : null;
  });

  return (
    <div className="review-modal">
      <Modal
        title={paper.title}
        visible={props.visible}
        onCancel={props.onClose}
        footer={props.footer}
        destroyOnClose
        width="80%"
      >
        <PaperTable paper={paper} keywords={notes.keywords} />
        <br />
        <Alert type="info" message="TLDR" description={notes.tldr} showIcon />
        <hr />
        {reviewBody}
      </Modal>
    </div>
  );
}

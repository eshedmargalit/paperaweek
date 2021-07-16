import React from 'react';
import { Alert, Modal } from 'antd';
import { wrapMarkdownWithMath, stringArrayHasNonEmpty, stringNotEmpty } from '../utils';
import { Maybe, Review } from '../../types';
import PaperTable from './PaperTable';
import './ReviewModal.scss';

export interface ReviewModalProps {
  review: Review;
  visible: boolean;
  onClose: VoidFunction;
  buttons: Maybe<JSX.Element[]>;
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

export default function ReviewModal({ review, visible, onClose, buttons }: ReviewModalProps): JSX.Element {
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

  const ModalTitle = () => (
    <div className="flex modal-title">
      {paper.title}
      <span className="action-items">{buttons}</span>
    </div>
  );

  return (
    <Modal title={<ModalTitle />} visible={visible} onCancel={onClose} footer={null} destroyOnClose width="80%">
      <div className="review-modal">
        <PaperTable paper={paper} keywords={notes.keywords} />
        <br />
        {tldr}
        <hr />
        {reviewBody}
      </div>
    </Modal>
  );
}

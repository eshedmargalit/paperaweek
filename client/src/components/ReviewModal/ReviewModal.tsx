import React from 'react';
import { Modal, Tag } from 'antd';
import moment from 'moment';
import { renderCommaSepList, wrapMarkdownWithMath } from '../utils';
import { Maybe, Review } from '../../types';

export interface ReviewModalProps {
  review: Review;
  visible: boolean;
  onClose: VoidFunction;
  footer: Maybe<JSX.Element[]>;
}

const getTagColor = (tag: string) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    // eslint-disable-next-line no-bitwise
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }

  const shortened = hash % 360;
  const saturation = '80%';
  const lightness = '30%';
  return `hsl(${shortened},${saturation},${lightness})`;
};

const renderTags = (tags: string[] | undefined) => {
  if (!tags || !tags.length) return null;

  return tags.map(tag => {
    if (tag === '') {
      return null;
    }
    return (
      <Tag color={getTagColor(tag)} key={tag}>
        {tag}
      </Tag>
    );
  });
};

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
  const paperDate: string = moment(paper.date, 'YYYY-MM').format('MMMM YYYY');

  const doiTag: Maybe<JSX.Element> = paper.doi ? (
    <a href={`http://dx.doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer">
      ({paper.doi})
    </a>
  ) : null;

  const reviewBody = fields.map(field => {
    let empty = true;
    const toRender = (
      <div key={field.heading}>
        <strong>{field.heading}</strong>
        <ul>
          {notes[field.notesKey].map((point: string) => {
            if (point !== '') {
              empty = false;
            }
            return <li key={point}>{wrapMarkdownWithMath(point)}</li>;
          })}
        </ul>
      </div>
    );

    return empty ? null : toRender;
  });

  const titleDiv = (
    <div>
      <div>{paper.title}</div>
      <div>{renderTags(notes.keywords)}</div>
    </div>
  );

  return (
    <div>
      <Modal
        title={titleDiv}
        visible={props.visible}
        onCancel={props.onClose}
        footer={props.footer}
        destroyOnClose
        width="80%"
      >
        <div>
          {renderCommaSepList(paper.authors)}
          {paper.institutions ? renderCommaSepList(paper.institutions) : null}
          Published in {paper.journal} in {paperDate} {doiTag}
        </div>
        <br />
        <strong>TLDR</strong>
        <br />
        {notes.tldr}
        {reviewBody}
      </Modal>
    </div>
  );
}

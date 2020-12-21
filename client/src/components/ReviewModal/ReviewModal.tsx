import React, { useState } from 'react';
import { Space, Switch, Modal, Tag } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { renderCommaSepList, wrapMarkdownWithMath } from '../utils';
import { Maybe, Review } from '../../types';

export interface ReviewModalProps {
  review: Review;
  renderMath: boolean;
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
    heading: 'Background',
    reviewKey: 'background_points',
  },
  {
    heading: 'Approach',
    reviewKey: 'approach_points',
  },
  {
    heading: 'Results',
    reviewKey: 'results_points',
  },
  {
    heading: 'Conclusions',
    reviewKey: 'conclusions_points',
  },
  {
    heading: 'Other Information',
    reviewKey: 'other_points',
  },
] as const;

export default function ReviewModal(props: ReviewModalProps): JSX.Element {
  const [renderMath, setRenderMath] = useState<boolean>(props.renderMath);
  const [switchLoading, setSwitchLoading] = useState(false);

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
          {notes[field.reviewKey].map(point => {
            if (point !== '') {
              empty = false;
            }
            return <li key={point}>{renderMath ? wrapMarkdownWithMath(point) : point}</li>;
          })}
        </ul>
      </div>
    );

    return empty ? null : toRender;
  });

  const titleDiv = (
    <div>
      <div>{paper.title}</div>
      <div>{renderTags(paper.keywords)}</div>
    </div>
  );

  const handleLatexToggle = async (isChecked: boolean) => {
    setRenderMath(isChecked);

    // set preference in user profile
    const values = { renderMath: isChecked };
    setSwitchLoading(true);
    try {
      await axios.put('/api/user', values);
    } catch (err) {
      setRenderMath(!isChecked);
    }
    setSwitchLoading(false);
  };

  const toggleSwitch: JSX.Element = (
    <Space align="start">
      <div>
        <Switch defaultChecked={renderMath} onChange={handleLatexToggle} loading={switchLoading} /> Render
      </div>
      <div>{wrapMarkdownWithMath('$\\rm\\LaTeX$ + Markdown')}</div>
    </Space>
  );

  return (
    <div>
      <Modal title={titleDiv} visible={props.visible} onCancel={props.onClose} footer={props.footer} width="80%">
        <div>
          {renderCommaSepList(paper.authors, 'authors')}
          {paper.institutions ? renderCommaSepList(paper.institutions, 'institutions') : null}
          Published in {paper.journal} in {paperDate} {doiTag}
        </div>
        <br />
        <strong>TLDR</strong>
        <br />
        {paper.one_sentence}
        <hr />
        <div style={{ float: 'right' }}>{toggleSwitch}</div>
        {reviewBody}
      </Modal>
    </div>
  );
}

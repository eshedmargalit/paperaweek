import React, { Fragment } from 'react';
import { Descriptions, Tag } from 'antd';
import moment from 'moment';

import { Notes, Paper } from '../../types';
import { renderCommaSepList } from '../utils';

type PaperTableProps = {
  paper: Paper;
} & Pick<Notes, 'keywords'>;

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

const SafeLink = ({ href, children }: { href: string; children: React.ReactNode }): JSX.Element => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

const stringNotEmpty = (s: string): boolean => s !== '';
const stringArrayHasNonEmpty = (arr: string[]): boolean => arr.some(item => stringNotEmpty(item));

interface TableItem {
  label: string;
  render: boolean;
  guts: JSX.Element;
}

export default function PaperTable({ paper, keywords }: PaperTableProps): JSX.Element {
  const { authors, institutions, journal, url, doi, date } = paper;
  const institutionsList = institutions ? <div>{renderCommaSepList(institutions)}</div> : <></>;
  const keywordRender = keywords && keywords.length ? <div>{renderTags(keywords)}</div> : <></>;
  const items: TableItem[] = [
    {
      label: 'Institutions',
      render: !!institutions && stringArrayHasNonEmpty(institutions),
      guts: institutionsList,
    },
    {
      label: 'Journal',
      render: !!journal && stringNotEmpty(journal),
      guts: <div>{journal}</div>,
    },
    {
      label: 'URL',
      render: !!url && stringNotEmpty(url),
      guts: url ? <SafeLink href={url}>{url}</SafeLink> : <></>,
    },
    {
      label: 'DOI',
      render: !!doi && stringNotEmpty(doi),
      guts: doi ? <SafeLink href={doi}>{doi}</SafeLink> : <></>,
    },
    {
      label: 'Keywords',
      render: stringArrayHasNonEmpty(keywords),
      guts: keywordRender,
    },
  ];

  return (
    <Descriptions bordered column={2}>
      <Descriptions.Item label="Authors">{renderCommaSepList(authors)}</Descriptions.Item>
      <Descriptions.Item label="Publication Date">{moment(date, 'YYYY-MM').format('MMMM YYYY')}</Descriptions.Item>
      {items.map(({ label, render, guts }) =>
        render ? <Descriptions.Item label={label}>{guts}</Descriptions.Item> : null
      )}
    </Descriptions>
  );
}

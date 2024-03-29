import React from 'react';
import { Descriptions } from 'antd';
import moment from 'moment';

import { Notes, Paper } from '../../types';
import { renderCommaSepList, stringArrayHasNonEmpty, stringNotEmpty } from '../utils';
import TagList from '../TagList';

type PaperTableProps = {
  paper: Paper;
} & Pick<Notes, 'keywords'>;

const SafeLink = ({ href, children }: { href: string; children: React.ReactNode }): JSX.Element => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

interface TableItem {
  label: string;
  render: boolean;
  guts: JSX.Element;
}

export default function PaperTable({ paper, keywords }: PaperTableProps): JSX.Element {
  const { authors, institutions, journal, url, doi, date } = paper;
  const institutionsList = institutions ? <div>{renderCommaSepList(institutions)}</div> : <></>;
  const keywordRender = keywords && keywords.length ? <TagList tags={keywords} onClick={undefined} /> : <></>;
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
    <div className="review-modal__table">
      <Descriptions bordered column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}>
        <Descriptions.Item label="Authors">{renderCommaSepList(authors)}</Descriptions.Item>
        <Descriptions.Item label="Publication Date">{moment(date, 'YYYY-MM').format('MMMM YYYY')}</Descriptions.Item>
        {items.map(({ label, render, guts }) =>
          render ? (
            <Descriptions.Item key={label} label={label}>
              {guts}
            </Descriptions.Item>
          ) : null
        )}
      </Descriptions>
    </div>
  );
}

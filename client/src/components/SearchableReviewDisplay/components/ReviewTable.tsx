import React from 'react';
import Table, { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { Review } from '../../../types';
import { shortenAuthors, shortenTableString } from '../../utils';
import { SearchHandler } from '../types';
import TableTags from './TableTags';

interface ReviewTableProps {
  reviews: Review[];
  handleSearch: SearchHandler;
  reviewClicked: (review: Review) => void;
}

const displaySettings = {
  titleStringLengthLimit: 150,
  journalStringLengthLimit: 30,
  tldrStringLengthLimit: 80,
};

export default function ReviewTable({ reviews, handleSearch, reviewClicked }: ReviewTableProps): JSX.Element {
  const columns: ColumnsType<Review> = [
    {
      title: 'Title',
      dataIndex: ['paper', 'title'],
      render: (title: string) => shortenTableString(title, displaySettings.titleStringLengthLimit),
    },
    {
      title: 'One Sentence',
      dataIndex: ['notes', 'tldr'],
      render: (tldr: string) => shortenTableString(tldr, displaySettings.tldrStringLengthLimit),
    },
    {
      title: 'Authors',
      dataIndex: ['paper', 'authors'],
      render: (authorList: string[]) => shortenAuthors(authorList),
    },
    {
      title: 'Year Published',
      dataIndex: ['paper', 'date'],
      render: (date: Date) => <span>{moment(date, 'YYYY-MM').format('YYYY')}</span>,
      sorter: (a: Review, b: Review) => moment(a.paper.date).diff(moment(b.paper.date)),
    },
    {
      title: 'Journal',
      dataIndex: ['paper', 'journal'],
      render: (journal: string) => shortenTableString(journal, displaySettings.journalStringLengthLimit),
    },
    {
      title: 'Review Date',
      dataIndex: 'createdAt',
      render: (date: Date) => <span>{moment(date).format('MMMM Do, YYYY')}</span>,
      sorter: (a: Review, b: Review) => moment(a.createdAt).diff(moment(b.createdAt)),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Keywords',
      dataIndex: ['notes', 'keywords'],
      render: (keywords: string[]) => <TableTags tags={keywords} handleSearch={handleSearch} />,
    },
  ];

  return (
    <Table
      onRow={(review) => ({
        onClick: () => {
          reviewClicked(review);
        },
      })}
      // TODO: Create a type in which _id is required and use it here instead of Review
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      rowKey={(review) => review._id!}
      columns={columns}
      dataSource={reviews}
      pagination={reviews.length > 10 && { position: ['bottomRight'] }}
      scroll={{ x: '100%' }}
    />
  );
}

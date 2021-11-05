import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Empty, List, PageHeader } from 'antd';
import { OrderedListOutlined, DeleteOutlined, FormOutlined, MenuOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle, SortEndHandler } from 'react-sortable-hoc';
import moment from 'moment';
import { shortenAuthors, shortenString, stringArrayHasNonEmpty } from '../utils';
import './ReadingList.scss';
import { Paper } from '../../types';
import ManualReadingListAdder from './ManualReadingListAdder';
import NAText from '../NAText';

const LIST_HEIGHT = 340;
const TITLE_CUTOFF = 100;

const DragHandle = SortableHandle(() => <MenuOutlined className="reading-list__item-handle" />);

type SortableItemProps = Pick<ReadingListViewProps, 'handleDeleteClick' | 'handleEditClick'> & {
  value: Paper;
  sortIndex: number;
};

const SortableItem = SortableElement(({ value, handleEditClick, handleDeleteClick }: SortableItemProps) => (
  <List.Item>
    <div className="reading-list__item">
      <DragHandle />
      <div className="reading-list__item-container">
        <div>
          <List.Item.Meta
            title={shortenString(value.title, TITLE_CUTOFF)}
            description={
              stringArrayHasNonEmpty(value.authors) ? (
                `${shortenAuthors(value.authors)}, ${moment(value.date, 'YYYY-MM').format('YYYY')}`
              ) : (
                <NAText />
              )
            }
          />
        </div>
        <div>
          <div className="reading-list__item-button">
            <Link to="/form">
              <Button onClick={() => handleEditClick(value)} icon={<FormOutlined />} />
            </Link>
          </div>
          <div>
            <Button onClick={() => handleDeleteClick(value)} icon={<DeleteOutlined />} />
          </div>
        </div>
      </div>
    </div>
  </List.Item>
));

type SortableInfiniteListProps = Pick<ReadingListViewProps, 'items' | 'handleEditClick' | 'handleDeleteClick'>;

const SortableInfiniteList = SortableContainer(
  ({ items, handleEditClick, handleDeleteClick }: SortableInfiniteListProps) => (
    <List bordered style={{ height: LIST_HEIGHT, overflow: 'scroll' }}>
      {items.map((value, index) => (
        <SortableItem
          key={`item-${value.title}`}
          index={index}
          sortIndex={index}
          value={value}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      ))}
    </List>
  )
);

export interface ReadingListViewProps {
  onSortEnd: SortEndHandler;
  items: Paper[];
  handleEditClick: (paper: Paper) => void;
  handleDeleteClick: (paper: Paper) => void;
}

export default function ReadingListView({
  onSortEnd,
  items,
  handleEditClick,
  handleDeleteClick,
}: ReadingListViewProps): JSX.Element {
  const noList = (
    <div className="empty-list ant-list-bordered" style={{ height: LIST_HEIGHT }}>
      <Empty description={<span>Add papers to your reading list from the search bar!</span>} />
    </div>
  );

  const sortableList = (
    <SortableInfiniteList
      onSortEnd={onSortEnd}
      items={items}
      handleEditClick={handleEditClick}
      handleDeleteClick={handleDeleteClick}
      useDragHandle
    />
  );
  return (
    <div className="reading-list">
      <PageHeader title="Reading List" avatar={{ icon: <OrderedListOutlined /> }} />
      {items.length > 0 ? sortableList : noList}
      <hr />
      <ManualReadingListAdder />
    </div>
  );
}

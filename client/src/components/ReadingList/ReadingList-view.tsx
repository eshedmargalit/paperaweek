import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Empty, List, PageHeader } from 'antd';
import { OrderedListOutlined, DeleteOutlined, FormOutlined, MenuOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle, SortEndHandler } from 'react-sortable-hoc';
import moment from 'moment';
import Infinite from 'react-infinite';
import { shortenAuthors } from '../utils';
import './ReadingList.scss';
import { Paper } from '../../types';

const LIST_HEIGHT = 340;
const ITEM_HEIGHT = 130;

const DragHandle = SortableHandle(() => (
  <MenuOutlined style={{ fontSize: '14pt', marginBottom: '5px', marginRight: '15px' }} />
));

type SortableItemProps = Pick<ReadingListViewProps, 'handleDeleteClick' | 'handleEditClick'> & {
  height: number;
  value: Paper;
  sortIndex: number;
};

const SortableItem = SortableElement(
  ({ height, value, sortIndex, handleEditClick, handleDeleteClick }: SortableItemProps) => (
    <List.Item style={{ height }}>
      <div className="reading-list__item">
        <DragHandle />
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            justifyContent: 'space-between',
            overflow: 'auto',
          }}
        >
          <div>
            <List.Item.Meta
              title={`#${sortIndex + 1}: ${value.title}`}
              description={`${shortenAuthors(value.authors)}, ${moment(value.date, 'YYYY-MM').format('YYYY')}`}
            />
          </div>
          <div>
            <div className="reading-list__form-button">
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
  )
);

type SortableInfiniteListProps = Pick<ReadingListViewProps, 'items' | 'handleEditClick' | 'handleDeleteClick'>;

const SortableInfiniteList = SortableContainer(
  ({ items, handleEditClick, handleDeleteClick }: SortableInfiniteListProps) => (
    <List bordered>
      <Infinite containerHeight={LIST_HEIGHT} elementHeight={ITEM_HEIGHT}>
        {items.map((value, index) => (
          <SortableItem
            height={ITEM_HEIGHT}
            key={`item-${value.title}`}
            index={index}
            sortIndex={index}
            value={value}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
          />
        ))}
      </Infinite>
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
    <div>
      <br />
      <PageHeader title="Reading List" avatar={{ icon: <OrderedListOutlined /> }} />
      {items.length > 0 ? sortableList : noList}
    </div>
  );
}

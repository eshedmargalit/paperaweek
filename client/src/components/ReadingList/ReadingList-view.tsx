import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Empty, List } from 'antd';
import PageHeader from '../utils/PageHeader';
import { OrderedListOutlined, DeleteOutlined, FormOutlined, MenuOutlined } from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import moment from 'moment';
import { shortenAuthors, shortenString, stringArrayHasNonEmpty } from '../utils';
import './ReadingList.scss';
import { Paper } from '../../types';
import ManualReadingListAdder from './ManualReadingListAdder';
import NAText from '../NAText';

const LIST_HEIGHT = 340;
const TITLE_CUTOFF = 100;

type SortableItemProps = Pick<ReadingListViewProps, 'handleDeleteClick' | 'handleEditClick'> & {
  value: Paper;
  id: string;
};

function SortableItem({ value, handleEditClick, handleDeleteClick, id }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <List.Item ref={setNodeRef} style={style}>
      <div className="reading-list__item">
        <MenuOutlined className="reading-list__item-handle" {...attributes} {...listeners} />
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
  );
}

export interface ReadingListViewProps {
  onDragEnd: (event: DragEndEvent) => void;
  items: Paper[];
  handleEditClick: (paper: Paper) => void;
  handleDeleteClick: (paper: Paper) => void;
}

export default function ReadingListView({
  onDragEnd,
  items,
  handleEditClick,
  handleDeleteClick,
}: ReadingListViewProps): JSX.Element {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const noList = (
    <div className="empty-list ant-list-bordered" style={{ height: LIST_HEIGHT }}>
      <Empty description={<span>Add papers to your reading list from the search bar!</span>} />
    </div>
  );

  const itemIds = items.map((item, index) => `item-${index}`);

  const sortableList = (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <List bordered style={{ height: LIST_HEIGHT, overflow: 'scroll' }}>
          {items.map((value, index) => (
            <SortableItem
              key={`item-${index}`}
              id={`item-${index}`}
              value={value}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
            />
          ))}
        </List>
      </SortableContext>
    </DndContext>
  );

  return (
    <div className="reading-list">
      <PageHeader title="Reading List" avatar={{ icon: <OrderedListOutlined /> }} />
      {items.length > 0 ? sortableList : noList}
      <ManualReadingListAdder />
    </div>
  );
}

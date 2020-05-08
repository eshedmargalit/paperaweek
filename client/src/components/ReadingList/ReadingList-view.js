import React from 'react';
import { Button, Empty, List, PageHeader } from 'antd';
import { DeleteOutlined, FormOutlined, MenuOutlined } from '@ant-design/icons';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import moment from 'moment';
import Infinite from 'react-infinite';
import { shortenAuthors } from '../utils';
import './ReadingList.scss';

const LIST_HEIGHT = 340;
const ITEM_HEIGHT = 130;

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ fontSize: '14pt', marginBottom: '5px', marginRight: '15px' }} />
));

const SortableItem = sortableElement(({ height, value, sortIndex, editClickHandler, deleteClickHandler }) => (
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
            <Button onClick={() => editClickHandler(value)} icon={<FormOutlined />} />
          </div>
          <div>
            <Button onClick={() => deleteClickHandler(value)} icon={<DeleteOutlined />} />
          </div>
        </div>
      </div>
    </div>
  </List.Item>
));

const SortableInfiniteList = sortableContainer(({ items, editClickHandler, deleteClickHandler }) => {
  return (
    <List bordered={true}>
      <Infinite containerHeight={LIST_HEIGHT} elementHeight={ITEM_HEIGHT}>
        {items.map((value, index) => (
          <SortableItem
            key={`item-${value.title}`}
            index={index}
            sortIndex={index}
            value={value}
            editClickHandler={editClickHandler}
            deleteClickHandler={deleteClickHandler}
          />
        ))}
      </Infinite>
    </List>
  );
});

function ReadingListView(props) {
  const noList = (
    <div className="empty-list ant-list-bordered" style={{ height: LIST_HEIGHT }}>
      <Empty description={<span>Add papers to your reading list from the search bar!</span>} />
    </div>
  );

  const sortableList = (
    <SortableInfiniteList
      onSortEnd={props.onSortEnd}
      items={props.items}
      editClickHandler={props.handleEditClick}
      deleteClickHandler={props.handleDeleteClick}
      useDragHandle
    />
  );
  return (
    <div>
      <br />
      <PageHeader title="Reading List" avatar={{ icon: 'ordered-list' }} />
      {props.items.length > 0 ? sortableList : noList}
    </div>
  );
}

export default ReadingListView;

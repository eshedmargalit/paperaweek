import React, { Component } from 'react';
import { connect } from 'react-redux';
import { start_review } from '../../actions/index';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import { Button, Empty, Icon, List, PageHeader } from 'antd';
import moment from 'moment';
import Infinite from 'react-infinite';
import { shortenAuthors } from '../utils';
import './ReadingList.css';

const LIST_HEIGHT = 340;
const ITEM_HEIGHT = 130;

const DragHandle = sortableHandle(() => (
  <Icon
    style={{ fontSize: '14pt', marginBottom: '5px', marginRight: '15px' }}
    type="menu"
  />
));

const SortableItem = sortableElement(
  ({ height, value, sortIndex, editClickHandler, deleteClickHandler }) => (
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
              description={`${shortenAuthors(value.authors)}, ${moment(
                value.date,
                'YYYY-MM'
              ).format('YYYY')}`}
            />
          </div>
          <div>
            <div className="reading-list__form-button">
              <Button onClick={() => editClickHandler(value)} icon="form" />
            </div>
            <div>
              <Button onClick={() => deleteClickHandler(value)} icon="delete" />
            </div>
          </div>
        </div>
      </div>
    </List.Item>
  )
);

const SortableInfiniteList = sortableContainer(
  ({ items, editClickHandler, deleteClickHandler }) => {
    return (
      <List bordered={true}>
        <Infinite containerHeight={LIST_HEIGHT} elementHeight={ITEM_HEIGHT}>
          {items.map((value, index) => (
            <SortableItem
              key={`item-${value.title}`}
              index={index}
              sortIndex={index}
              value={value}
              height={ITEM_HEIGHT}
              editClickHandler={editClickHandler}
              deleteClickHandler={deleteClickHandler}
            />
          ))}
        </Infinite>
      </List>
    );
  }
);

class ReadingList extends Component {
  handleEditClick(value) {
    const review = {
      paper: value,
      review: {
        summary_points: [''],
        background_points: [''],
        approach_points: [''],
        results_points: [''],
        conclusions_points: [''],
        other_points: [''],
      },
    };
    this.props.dispatch(start_review(review));
  }

  handleDeleteClick(index) {
    this.props.removeItemHandler(index);
  }

  render() {
    let sortableList = (
      <SortableInfiniteList
        onSortEnd={this.props.onSortEnd}
        items={this.props.items}
        editClickHandler={this.handleEditClick.bind(this)}
        deleteClickHandler={this.handleDeleteClick.bind(this)}
        useDragHandle
      />
    );

    let noList = (
      <div
        className="empty-list ant-list-bordered"
        style={{ height: LIST_HEIGHT }}
      >
        <Empty
          description={
            <span>
              Add papers to your reading list from the search bar, just press
              the <Icon type="plus" /> button!
            </span>
          }
        />
      </div>
    );

    return (
      <div>
        <br />
        <PageHeader title="Reading List" avatar={{ icon: 'ordered-list' }} />
        {this.props.items.length > 0 ? sortableList : noList}
      </div>
    );
  }
}

export default connect()(ReadingList);

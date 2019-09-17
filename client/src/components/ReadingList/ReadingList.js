import React, { Component } from "react";
import { connect } from "react-redux";
import { start_review } from "../../actions/index";
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from "react-sortable-hoc";
import { Button, Empty, Icon, List, PageHeader } from "antd";
import moment from "moment";
import Infinite from "react-infinite";
import { shortenAuthors } from "../utils";
import "./ReadingList.css";

const LIST_HEIGHT = 340;
const ITEM_HEIGHT = 100;

const DragHandle = sortableHandle(() => (
  <Icon
    style={{ fontSize: "14pt", marginBottom: "5px", marginRight: "15px" }}
    type="menu"
  />
));

const SortableItem = sortableElement(
  ({ height, value, sortIndex, clickHandler }) => (
    <List.Item style={{ height }}>
      <DragHandle />
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between"
        }}
      >
        <div>
          <List.Item.Meta
            title={`#${sortIndex + 1}: ${value.metadata.title}`}
            description={`${shortenAuthors(value.metadata.authors)}, ${moment(
              value.metadata.date,
              "YYYY-MM"
            ).format("YYYY")}`}
          />
        </div>
        <div>
          <Button onClick={() => clickHandler(value)} icon="form" />
        </div>
      </div>
    </List.Item>
  )
);

const SortableInfiniteList = sortableContainer(({ items, clickHandler }) => {
  return (
    <List bordered={true}>
      <Infinite containerHeight={LIST_HEIGHT} elementHeight={ITEM_HEIGHT}>
        {items.map((value, index) => (
          <SortableItem
            key={`item-${value.metadata.title}`}
            index={index}
            sortIndex={index}
            value={value}
            height={ITEM_HEIGHT}
            clickHandler={clickHandler}
          />
        ))}
      </Infinite>
    </List>
  );
});

class ReadingList extends Component {
  handleClick(value) {
    this.props.dispatch(start_review(value));
  }

  render() {
    let sortableList = (
      <SortableInfiniteList
        onSortEnd={this.props.onSortEnd}
        items={this.props.items}
        clickHandler={this.handleClick.bind(this)}
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
        <PageHeader title="Reading List" avatar={{ icon: "ordered-list" }} />
        {this.props.items.length > 0 ? sortableList : noList}
      </div>
    );
  }
}

export default connect()(ReadingList);

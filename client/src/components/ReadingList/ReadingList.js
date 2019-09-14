import React, { Component } from "react";
import { connect } from "react-redux";
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from "react-sortable-hoc";
import { Button, Icon, List, PageHeader } from "antd";
import Infinite from "react-infinite";

const LIST_HEIGHT = 300;
const ITEM_HEIGHT = 100;

const DragHandle = sortableHandle(() => (
  <Icon
    style={{ fontSize: "14pt", marginBottom: "5px", marginRight: "15px" }}
    type="menu"
  />
));

const SortableItem = sortableElement(({ height, value, sortIndex }) => (
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
          title={`#${sortIndex + 1}: ${value.title}`}
          description={value.authors}
        />
      </div>
      <div>
        <Button
          onClick={() => {
            console.log(value);
          }}
        >
          Start Review <Icon type="form" />
        </Button>
      </div>
    </div>
  </List.Item>
));

const SortableInfiniteList = sortableContainer(({ items }) => {
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
          />
        ))}
      </Infinite>
    </List>
  );
});

class ReadingList extends Component {
  render() {
    return (
      <div>
        <br />
        <PageHeader title="Reading List" avatar={{ icon: "ordered-list" }} />
        <SortableInfiniteList
          onSortEnd={this.props.onSortEnd}
          items={this.props.items}
          useDragHandle
        />
      </div>
    );
  }
}

export default connect()(ReadingList);

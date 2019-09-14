import React, { Component } from "react";
import { connect } from "react-redux";
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from "react-sortable-hoc";
import { Icon, List, PageHeader } from "antd";

const DragHandle = sortableHandle(() => (
  <Icon
    style={{ fontSize: "14pt", marginBottom: "5px", marginRight: "5px" }}
    type="menu"
  />
));

const SortableItem = sortableElement(({ value }) => (
  <List.Item>
    <DragHandle />
    <h4>{value.title}</h4>
    <em>{value.authors}</em>
  </List.Item>
));

const SortableContainer = sortableContainer(({ children }) => {
  return <List bordered={true}>{children}</List>;
});

class ReadingList extends Component {
  render() {
    return (
      <div>
        <br />
        <PageHeader title="Reading List" avatar={{ icon: "read" }} />
        <SortableContainer onSortEnd={this.props.onSortEnd} useDragHandle>
          {this.props.items.map((value, index) => (
            <SortableItem
              key={`item-${value.title}`}
              index={index}
              value={value}
            />
          ))}
        </SortableContainer>
      </div>
    );
  }
}

export default connect()(ReadingList);

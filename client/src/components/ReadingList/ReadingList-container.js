import React, { Component } from 'react';
import ReadingListView from './ReadingList-view';

class ReadingListContainer extends Component {
  render() {
    return (
      <ReadingListView
        items={this.props.readingList}
        onSortEnd={this.props.onSortEnd}
        handleEditClick={this.props.handleEditClick}
        handleDeleteClick={this.props.handleDeleteClick}
      />
    );
  }
}

export default ReadingListContainer;

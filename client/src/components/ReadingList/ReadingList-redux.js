import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { startReview, updateReadingList, updateDraftId } from '../../actions';
import ReadingListContainer from './ReadingList-container';

import arrayMove from 'array-move';

class ReadingListRedux extends Component {
  updateReadingList = async newReadingList => {
    this.props.dispatch(updateReadingList(newReadingList));

    const res = await axios.put('api/readingList', newReadingList);
    this.props.dispatch(updateReadingList(res.data));
  };

  handleEditClick(value) {
    this.props.dispatch(updateDraftId(null));
    this.props.dispatch(startReview(value._id, null));
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    let newReadingList = arrayMove(this.props.readingList, oldIndex, newIndex);
    this.updateReadingList(newReadingList);
  };

  removeFromReadingList = paper => {
    let newReadingList = this.props.readingList.filter(currPaper => {
      return currPaper !== paper;
    });
    this.updateReadingList(newReadingList);
  };

  render() {
    let { readingList, user } = this.props;
    return (
      <ReadingListContainer
        readingList={readingList}
        user={user}
        handleEditClick={this.handleEditClick.bind(this)}
        handleDeleteClick={this.removeFromReadingList.bind(this)}
        onSortEnd={this.onSortEnd.bind(this)}
      />
    );
  }
}

const mapStateToProps = ({ readingList, user }) => {
  return {
    readingList,
    user,
  };
};

export default connect(
  mapStateToProps,
  null
)(ReadingListRedux);

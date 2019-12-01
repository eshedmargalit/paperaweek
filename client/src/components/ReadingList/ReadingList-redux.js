import React, { Component } from 'react';
import { connect } from 'react-redux';
import { startReview, updateReadingList } from '../../actions';
import ReadingListContainer from './ReadingList-container';

import arrayMove from 'array-move';

class ReadingListRedux extends Component {
  updateReadingList = newReadingList => {
    this.props.dispatch(updateReadingList(newReadingList));

    let headers = {
      'content-type': 'application/json',
      userid: this.props.user.userid,
    };

    fetch('/api/readingList', {
      method: 'put',
      headers: headers,
      body: JSON.stringify(newReadingList),
    })
      .then(response => response.json())
      .then(data => {
        this.props.dispatch(updateReadingList(data));
      });
  };

  handleEditClick(value) {
    this.props.dispatch(startReview(value._id));
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

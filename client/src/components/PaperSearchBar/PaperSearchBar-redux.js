import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { startReview, updateReadingList } from '../../actions';
import PaperSearchBarContainer from './PaperSearchBar-container';

class PaperSearchBarRedux extends Component {
  startBlankReview = () => {
    this.props.dispatch(startReview(null, null));
  };

  updateReadingList = async newReadingList => {
    this.props.dispatch(updateReadingList(newReadingList));

    const res = await axios.put('api/readingList', newReadingList);
    this.props.dispatch(updateReadingList(res.data));
  };

  handleClickResult = ({ paper }) => {
    let { readingList } = this.props;
    let newReadingList = readingList.concat(paper);
    this.updateReadingList(newReadingList);
  };

  handleClickResultButton = ({ paper }) => {
    let reviewContent = {
      paper: paper,
      review: null,
    };
    this.props.dispatch(startReview(null, reviewContent));
  };

  render() {
    return (
      <PaperSearchBarContainer
        startBlankReview={this.startBlankReview.bind(this)}
        handleClickResult={this.handleClickResult.bind(this)}
        handleClickResultButton={this.handleClickResultButton.bind(this)}
      />
    );
  }
}

const mapStateToProps = ({ readingList }) => {
  return {
    readingList,
  };
};

export default connect(
  mapStateToProps,
  null
)(PaperSearchBarRedux);

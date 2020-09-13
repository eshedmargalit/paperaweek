import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setReview, updateReadingList } from '../../actions';
import PaperSearchBarContainer from './PaperSearchBar-container';

class PaperSearchBarRedux extends Component {
  setBlankReview = () => {
    this.props.dispatch(setReview(null, null));
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
    this.props.dispatch(setReview(null, reviewContent));
  };

  render() {
    return (
      <PaperSearchBarContainer
        setBlankReview={this.setBlankReview.bind(this)}
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

export default connect(mapStateToProps, null)(PaperSearchBarRedux);

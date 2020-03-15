import React, { Component } from 'react';
import { connect } from 'react-redux';
import { startReview, updateReadingList } from '../../actions';
import PaperSearchBarContainer from './PaperSearchBar-container';

class PaperSearchBarRedux extends Component {
  startBlankReview = () => {
    this.props.dispatch(startReview(null, null));
  };

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
    let { carouselItems } = this.props;
    return (
      <PaperSearchBarContainer
        carouselItems={carouselItems}
        startBlankReview={this.startBlankReview.bind(this)}
        handleClickResult={this.handleClickResult.bind(this)}
        handleClickResultButton={this.handleClickResultButton.bind(this)}
      />
    );
  }
}

const mapStateToProps = ({ carouselItems, readingList, user }) => {
  return {
    carouselItems,
    readingList,
    user,
  };
};

export default connect(
  mapStateToProps,
  null
)(PaperSearchBarRedux);

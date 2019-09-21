import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Icon } from "antd";
import { FadeLoader } from "react-spinners";
import ReviewReader from "../ReviewReader/ReviewReader";
import ReadingList from "../ReadingList/ReadingList";
import PaperSearchBar from "../PaperSearchBar/PaperSearchBar";
import ReviewWizard from "../ReviewWizard/ReviewWizard";
import { start_review } from "../../actions/index";
import arrayMove from "array-move";

import "./Home.css";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      papers: [],
      readingList: []
    };
  }

  componentDidMount() {
    fetch("/api/papers")
      .then(response => response.json())
      .then(data => this.setState({ papers: data, loading: false }));
  }

  onReadingListSort = ({ oldIndex, newIndex }) => {
    this.setState({
      readingList: arrayMove(this.state.readingList, oldIndex, newIndex)
    });
  };

  signIn = () => {
    this.props.auth.getSession();
  };

  signOut = () => {
    this.props.auth.signOut();
  };

  refreshPapers = () => {
    fetch("/api/papers")
      .then(response => response.json())
      .then(data => this.setState({ papers: data, loading: false }));
  };

  startBlankReview = () => {
    this.props.dispatch(start_review(null));
  };

  addToReadingList = review => {
    // TODO: prevent dupes
    let currReadingList = this.state.readingList;
    let newReadingList = currReadingList.concat(review);
    this.setState({ readingList: newReadingList });
  };

  removeFromReadingList = review => {
    let newReadingList = this.state.readingList.filter(currReview => {
      return currReview !== review;
    });
    this.setState({ readingList: newReadingList });
  };

  render() {
    const home_render = (
      <div>
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className="width80"
        >
          <div style={{ width: "60%" }}>
            <PaperSearchBar addToReadingListHandler={this.addToReadingList} />
            <Button
              style={{ marginTop: "2px" }}
              onClick={this.startBlankReview}
            >
              Create Manual Entry <Icon type="plus-circle" />
            </Button>
          </div>
          <div style={{ width: "35%" }}>
            <ReadingList
              onSortEnd={this.onReadingListSort}
              removeItemHandler={this.removeFromReadingList}
              items={this.state.readingList}
            />
          </div>
        </div>
        <div className="width80">
          {this.state.loading ? (
            <div>
              <h6> Loading Reviews </h6>
              <FadeLoader />
            </div>
          ) : (
            <ReviewReader
              refreshPapers={this.refreshPapers}
              papers={this.state.papers}
            />
          )}
        </div>
      </div>
    );

    const form_render = (
      <div>
        <div className="width80">
          <ReviewWizard refreshPapers={this.refreshPapers} />
        </div>
      </div>
    );

    return (
      <div>
        {this.props.data.review_data.displayForm ? form_render : home_render}
        <div className="width80">
          <Button onClick={this.signIn}>Sign In</Button>
          <Button onClick={this.signOut}>Sign Out</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state
  };
};

export default connect(
  mapStateToProps,
  null
)(Home);

import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form, Icon } from "antd";
import { FadeLoader } from "react-spinners";
import ReviewReader from "../ReviewReader/ReviewReader";
import ReadingList from "../ReadingList/ReadingList";
import PaperSearchBar from "../PaperSearchBar/PaperSearchBar";
import ReviewForm from "../ReviewForm/ReviewForm";
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
    this.setState({
      readingList: [
        {
          title: "Item 1",
          authors: "Eshed Margalit, Arad Margalit, and Jenna Morris"
        },
        {
          title: "Item 2",
          authors: "Author A, Author B, Author C"
        },
        {
          title: "Item 3",
          authors: "Anonymous"
        }
      ]
    });

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
    const blank_metadata = {
      title: "",
      author_names: [""],
      institution_names: [""],
      date: new Date(),
      doi: "",
      journal: "",
      url: ""
    };
    this.props.dispatch(start_review(blank_metadata));
  };

  render() {
    // need to use Form.create to inject this.props.form in the ReviewForm component
    const WrappedReviewForm = Form.create({ name: "review_form" })(ReviewForm);

    const home_render = (
      <div>
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className="width80"
        >
          <div style={{ width: "60%" }}>
            <PaperSearchBar />
            <Button
              size="small"
              shape="round"
              type="dashed"
              style={{ marginTop: "2px" }}
              onClick={this.startBlankReview}
            >
              Create Manual Entry <Icon className="shifted-icon" type="plus" />
            </Button>
          </div>
          <div style={{ width: "35%" }}>
            <ReadingList
              onSortEnd={this.onReadingListSort}
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
          <WrappedReviewForm refreshPapers={this.refreshPapers} />
        </div>
      </div>
    );

    return (
      <div>
        {this.props.data.review.displayForm ? form_render : home_render}
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

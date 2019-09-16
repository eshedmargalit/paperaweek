import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Icon } from "antd";
import { FadeLoader } from "react-spinners";
import ReviewReader from "../ReviewReader/ReviewReader";
import PaperSearchBar from "../PaperSearchBar/PaperSearchBar";
import ReviewWizard from "../ReviewWizard/ReviewWizard";
import { start_review } from "../../actions/index";

import "./Home.css";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      papers: []
    };
  }

  componentDidMount() {
    fetch("/api/papers")
      .then(response => response.json())
      .then(data => this.setState({ papers: data, loading: false }));
  }

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

  render() {
    const home_render = (
      <div>
        <div className="width80">
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

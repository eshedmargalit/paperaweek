import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { FadeLoader } from "react-spinners";
import ReviewReader from "../ReviewReader/ReviewReader";
import PaperSearchBar from "../PaperSearchBar/PaperSearchBar";
import ReviewForm from "../ReviewForm/ReviewForm";
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

  render() {
    const home_render = (
      <div className="home-wrapper">
        <div style={{ width: "80%", margin: "auto" }}>
          <PaperSearchBar />
        </div>
        <div style={{ width: "80%", margin: "auto" }}>
          {this.state.loading ? (
            <div>
              <h6> Loading Reviews </h6>
              <FadeLoader />
            </div>
          ) : (
            <ReviewReader papers={this.state.papers} />
          )}
        </div>
        <div>
          <Link to="/Form">
            <Button type="primary" className="form-link-button">
              Write Review
            </Button>
          </Link>
        </div>
      </div>
    );

    const form_render = (
      <div>
        <div style={{ width: "80%", margin: "auto" }}>
          <ReviewForm />
        </div>
      </div>
    );

    return this.props.data.review.displayForm ? form_render : home_render;
  }
}

const mapStateToProps = state => {
  return {
    data: state
  };
};

export default connect(mapStateToProps)(Home);

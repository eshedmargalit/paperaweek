import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { FadeLoader } from "react-spinners";
import ReviewReader from "../ReviewReader/ReviewReader";
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
    return (
      <div className="home-wrapper">
        <div style={{ width: "80%", margin: "auto" }}>
          <Link to="/Form">
            <Button type="primary" className="form-link-button">
              Write Review
            </Button>
          </Link>
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
      </div>
    );
  }
}

export default Home;

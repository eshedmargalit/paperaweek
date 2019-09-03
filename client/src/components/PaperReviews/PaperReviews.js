import React, { Component } from "react";

import PaperAWeek from "./PaperAWeek.js";
import "./PaperReviews.css";

class PaperReviews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      papers: [],
    }
  }

  componentDidMount() {
    fetch("/api/papers")
      .then(response => response.json())
      .then(data => this.setState({papers: data}));
  }

  render() {
    return (
      <div style={{width: "80%", margin: "auto"}}>
        <PaperAWeek papers={this.state.papers}/>
      </div>
    );
  }
}

export default PaperReviews;

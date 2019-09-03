import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { Sparklines, SparklinesCurve, SparklinesSpots } from "react-sparklines";
import moment from "moment";

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

  compute_ppw() {
    if (this.state.papers.length === 0){
      return 0;
    }
    const review_dates = this.state.papers.map(paper => {
      return moment(paper.metadata.review_date, "YYYY-MM-DD");
    });
    const sorted_dates = review_dates.sort((a, b) => a.diff(b));
    const total_weeks =
      sorted_dates[sorted_dates.length - 1].diff(sorted_dates[0], "days") / 7.0;
    return Number.parseFloat(sorted_dates.length / total_weeks).toFixed(3);
  }

  compute_cumulative_number() {
    if (this.state.papers.length === 0){
      return [0, 0];
    }
    const review_dates = this.state.papers.map(paper => {
      return moment(paper.metadata.review_date, "YYYY-MM-DD");
    });
    const sorted_dates = review_dates.sort((a, b) => a.diff(b));

    var cumulative_number = [];
    var counter = 0;
    for (var i = 0; i < sorted_dates.length - 1; i++) {
      var diff = sorted_dates[i + 1].diff(sorted_dates[i], "days");
      counter += diff;
      cumulative_number.push(counter);
    }

    return cumulative_number;
  }

  render() {
    return (
      <Container>
        <Row>
          <Col xs="8" lg="8">
            <br />
            <h1>Paper-a-Week</h1>
            In recent years, I've been trying to develop a literature-reading
            habit that:
            <ul>
              <li>allows me to jot down notes in a consistent format</li>
              <li>provides a way to search through notes and paper metadata</li>
              <li>keeps me accountable to reading on a schedule</li>
            </ul>
            Enter <strong>Paper-a-Week</strong>, my attempt to meet those
            objectives! I've seen{" "}
            <a
              href="https://github.com/shagunsodhani/papers-I-read"
              target="_blank"
              rel="noopener noreferrer"
            >
              things like this
            </a>{" "}
            elsewhere, but the format and content of these entries are meant to
            serve my own interests.
          </Col>
          <Col>
            <br />
            <h5> How am I doing? </h5>
            <p>
              {" "}
              Papers / week: <strong>{this.compute_ppw()}</strong>{" "}
            </p>
            <Sparklines data={this.compute_cumulative_number()} height={75}>
              <SparklinesCurve />
              <SparklinesSpots />
            </Sparklines>
            <p className="float-right">
              <em>
                Cumulative review count: <strong>{this.state.papers.length}</strong>
              </em>
            </p>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <h6> How this works </h6>
            <ul>
              <li>
                {" "}
                Click through each paper to see my notes about background,
                methods, results, conclusions, and more{" "}
              </li>
              <li>
                {" "}
                The selected paper stays open in a new 'tab', so you can browse
                the rest of the list while leaving the current review open{" "}
              </li>
              <li>
                {" "}
                Each paper has a number of tags, each of which has a unique
                background color. Click tags to search by that keyword!
              </li>
              <li>
                {" "}
                The search bar allows you to search by title, author,
                publication year, or keyword{" "}
              </li>
            </ul>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <PaperAWeek papers={this.state.papers}/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default PaperReviews;

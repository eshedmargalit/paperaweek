import React, { Component } from "react";

import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

import { Button, Icon, Select, Input, Tag, List } from "antd";
import { FaArrowLeft } from "react-icons/fa";
import moment from "moment";
import Fuse from "fuse.js";

import "./PaperReviews.css";

class PaperAWeek extends Component {
  constructor(props) {
    super(props);
    this.navRef = React.createRef();

    this.state = {
      query: "",
      searchbar_value: "",
      active_paper: null,
      viewing_paper: false,
      current_paper_short_title: "",
      sort_mode: "review-date-descending"
    };
  }

  get_tag_color = tag => {
    var hash = 0;
    for (var i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }

    var shortened = hash % 360;
    const saturation = "80%";
    const lightness = "30%";
    return "hsl(" + shortened + "," + saturation + "," + lightness + ")";
  };

  render_comma_sep_list = items => {
    return items.map((item, i) => {
      let to_render;
      if (i === items.length - 1) {
        // last
        if (items.length === 1) {
          to_render = (
            <span>
              {item}
              <br />
            </span>
          );
        } else {
          to_render = (
            <span>
              and {item}
              <br />
            </span>
          );
        }
      } else if (i === items.length - 2) {
        // penultimate
        to_render = (
          <span>
            {item}
            {` `}
          </span>
        );
      } else {
        //all others
        to_render = (
          <span>
            {item},{` `}
          </span>
        );
      }
      return <span key={items.tag + item}>{to_render}</span>;
    });
  };

  handleSearch = search_term => {
    this.setState({
      query: search_term,
      searchbar_value: search_term
    });
  };

  handleSort = sort_mode => {
    this.setState({
      sort_mode: sort_mode
    });
  };

  render_tags = tags => {
    let tag_render = null;

    if (tags && tags.length > 0) {
      tag_render = tags.map(tag => {
        if (tag === "") {
          return null;
        }
        return (
          <span key={tag}>
            <Tag
              color={this.get_tag_color(tag)}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                this.handleSearch(`${e.target.innerHTML}`);
              }}
            >
              {tag}
            </Tag>
            {` `}
          </span>
        );
      });
    }
    return tag_render;
  };

  render_paper_in_list = paper => {
    const meta = paper.metadata;
    const review_date_render = moment(meta.review_date, "YYYY-MM-DD").format(
      "MMMM DD, YYYY"
    );
    const publication_date_render = moment(meta.date, "YYYY-MM").format(
      "MMMM YYYY"
    );

    let tldr = null;
    if (meta.one_sentence && meta.one_sentence !== "") {
      tldr = (
        <div>
          <em>{"In a sentence: " + meta.one_sentence}</em>
        </div>
      );
    }

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%"
        }}
      >
        <div>
          <h6>{meta.title}</h6>
          <div>
            {this.render_comma_sep_list(meta.authors)}
            Published {publication_date_render}
          </div>
          <div>{this.render_tags(meta.keywords)}</div>
          <div>
            <em>Read on {review_date_render}</em>
          </div>
          {tldr}
        </div>
        <div>
          <Button
            type="default"
            style={{ display: "flex", alignItems: "center" }}
            onClick={e => {
              e.preventDefault();
              this.review_clicked(paper);
            }}
          >
            View Review <Icon type="right-circle" />
          </Button>
        </div>
      </div>
    );
  };

  sort_reviews = reviews => {
    if (this.state.sort_mode === "review-date-descending") {
      return reviews.sort(
        (a, b) =>
          -moment(a.metadata.review_date).diff(moment(b.metadata.review_date))
      );
    } else if (this.state.sort_mode === "review-date-ascending") {
      return reviews.sort((a, b) =>
        moment(a.metadata.review_date).diff(moment(b.metadata.review_date))
      );
    } else if (this.state.sort_mode === "pub-date-descending") {
      return reviews.sort(
        (a, b) => -moment(a.metadata.date).diff(moment(b.metadata.date))
      );
    } else if (this.state.sort_mode === "pub-date-ascending") {
      return reviews.sort((a, b) =>
        moment(a.metadata.date).diff(moment(b.metadata.date))
      );
    }
  };

  trim_reviews = reviews => {
    if (this.state.query === "") {
      return reviews;
    }
    var options = {
      shouldSort: false,
      threshold: 0.2,
      location: 0,
      distance: 5000,
      maxPatternLength: 32,
      minMatchCharLength: 4,
      keys: [
        "metadata.title",
        "metadata.authors",
        "metadata.keywords",
        "metadata.date"
      ]
    };

    var fuse = new Fuse(reviews, options);
    const results = fuse.search(this.state.query);
    return results;
  };

  review_clicked = review => {
    const { date, authors } = review.metadata;
    const year = date.substring(0, 4);
    const n_authors = authors.length;

    let author_string;
    if (n_authors === 2) {
      author_string =
        authors[0].split(",")[0] + " and " + authors[1].split(",")[0];
    } else if (n_authors === 1) {
      author_string = authors[0].split(",")[0];
    } else {
      author_string = authors[0].split(",")[0] + " et al.";
    }

    const tab_str = author_string + ", " + year;

    this.setState({
      active_paper: review,
      viewing_paper: true,
      current_paper_short_title: tab_str
    });
  };

  render_papers = papers => {
    return (
      <List
        itemLayout="horizontal"
        dataSource={papers}
        renderItem={paper => (
          <List.Item>{this.render_paper_in_list(paper)}</List.Item>
        )}
      />
    );
  };

  render_review = paper => {
    const summary = (
      <div>
        <h6>General Summary</h6>
        <ul>
          {paper.review.summary.map(summary_point => {
            return <li key={summary_point}>{summary_point}</li>;
          })}
        </ul>
      </div>
    );

    const background = (
      <div>
        <h6>Background</h6>
        <ul>
          {paper.review.background.map(background_point => {
            return <li key={background_point}>{background_point}</li>;
          })}
        </ul>
      </div>
    );

    const approach = (
      <div>
        <h6>Approach and Methods</h6>
        <ul>
          {paper.review.approach.map(approach_point => {
            return <li key={approach_point}>{approach_point}</li>;
          })}
        </ul>
      </div>
    );

    const results = (
      <div>
        <h6>Results</h6>
        <ul>
          {paper.review.results.map(results_point => {
            return <li key={results_point}>{results_point}</li>;
          })}
        </ul>
      </div>
    );

    const conclusions = (
      <div>
        <h6>Conclusions</h6>
        <ul>
          {paper.review.conclusions.map(conclusions_point => {
            return <li key={conclusions_point}>{conclusions_point}</li>;
          })}
        </ul>
      </div>
    );

    let other = null;
    if (paper.review.other.length > 0) {
      other = (
        <div>
          <h6>Other information</h6>
          <ul>
            {paper.review.other.map(other_point => {
              return <li key={other_point}>{other_point}</li>;
            })}
          </ul>
        </div>
      );
    }

    const date_str = moment(paper.metadata.date, "YYYY-MM").format("MMMM YYYY");
    let doi_tag = null;
    if (paper.metadata.doi) {
      doi_tag = (
        <a
          href={"http://dx.doi.org/" + paper.metadata.doi}
          target="_blank"
          rel="noopener noreferrer"
        >
          ({paper.metadata.doi})
        </a>
      );
    }

    return (
      <Container>
        <Row>
          <Col>
            <h4>{paper.metadata.title}</h4>
            {this.render_comma_sep_list(paper.metadata.authors)}
            {this.render_comma_sep_list(paper.metadata.institutions)}
            Published in {paper.metadata.journal} in {date_str}
            {` `}
            {doi_tag}
            <hr />
            {summary}
            {background}
            {approach}
            {results}
            {conclusions}
            {other}
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              onClick={e => {
                this.setState({ viewing_paper: false });
                window.scrollTo(0, this.navRef.current.offsetTop);
              }}
              color="primary"
            >
              <FaArrowLeft /> Back to List of Reviews
            </Button>
          </Col>
        </Row>
      </Container>
    );
  };

  render() {
    const directory = (
      <div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <div style={{ width: "100%" }}>
            <div>Filter by author, year, title, or keyword:</div>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between"}}>
              <div style={{ width: "100%", marginRight: "100px" }}>
                <Input
                  type="text"
                  width="500px"
                  onChange={e => this.handleSearch(`${e.target.value}`)}
                  placeholder="e.g., orthogonal"
                  value={this.state.searchbar_value}
                  allowClear
                />
              </div>
              <div>
                <Select
                  defaultValue="review-date-descending"
                  style={{ width: 220 }}
                  id="sort_input"
                  onChange={this.handleSort}
                >
                  <Select.Option value="review-date-descending">
                    review date (descending)
                  </Select.Option>
                  <Select.Option value="review-date-ascending">
                    review date (ascending){" "}
                  </Select.Option>
                  <Select.Option value="pub-date-ascending">
                    publication date (ascending)
                  </Select.Option>
                  <Select.Option value="pub-date-descending">
                    publication date (descending)
                  </Select.Option>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>
            {this.render_papers(
              this.sort_reviews(this.trim_reviews(this.props.papers))
            )}
          </div>
        </div>
      </div>
    );

    let to_render = directory;
    let nav = (
      <Nav tabs>
        <NavItem>
          <NavLink className="nav-tab" active={!this.state.viewing_paper}>
            List of Reviews
          </NavLink>
        </NavItem>
      </Nav>
    );

    if (this.state.active_paper) {
      if (this.state.viewing_paper) {
        to_render = this.render_review(this.state.active_paper);
      } else {
        to_render = directory;
      }
      nav = (
        <Nav tabs>
          <NavItem>
            <NavLink
              className="nav-tab"
              onClick={e => {
                this.setState({
                  viewing_paper: false,
                  query: "",
                  searchbar_value: ""
                });
              }}
              active={!this.state.viewing_paper}
            >
              List of Reviews
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className="nav-tab"
              onClick={e => {
                this.setState({ viewing_paper: true });
              }}
              active={this.state.viewing_paper}
            >
              {this.state.current_paper_short_title}
            </NavLink>
          </NavItem>
        </Nav>
      );
    }
    return (
      <div ref={this.navRef}>
        {nav}
        <br />
        {to_render}
      </div>
    );
  }
}

export default PaperAWeek;

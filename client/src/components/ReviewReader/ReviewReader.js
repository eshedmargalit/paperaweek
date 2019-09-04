import React, { Component } from "react";
import { PageHeader, Button, Icon, Select, Input, Tag, List } from "antd";
import moment from "moment";
import Fuse from "fuse.js";

import {render_comma_sep_list} from "../utils.js";

class ReviewReader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      active_paper: null,
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

  handleSearch = search_term => {
    this.setState({
      query: search_term,
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
          <Tag
            color={this.get_tag_color(tag)}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              this.handleSearch(`${e.target.innerHTML}`);
            }}
            key={tag}
          >
            {tag}
          </Tag>
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
            {render_comma_sep_list(meta.authors, "authors")}
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
            size="large"
            style={{ display: "flex", alignItems: "center" }}
            onClick={e => {
              e.preventDefault();
              this.review_clicked(paper);
            }}
          >
            Read Review <Icon type="right-circle" />
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
    this.setState({
      active_paper: review,
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


    const fields = [
      {
        heading: "General Summary",
        review_key: "summary"
      },
      {
        heading: "Background",
        review_key: "background"
      },
      {
        heading: "Approach",
        review_key: "approach"
      },
      {
        heading: "Results",
        review_key: "results"
      },
      {
        heading: "Conclusions",
        review_key: "conclusions"
      },
      {
        heading: "Other Information",
        review_key: "other"
      }
    ];


    const review = fields.map(field => {
      return (
      <div key={field.heading}>
        <strong>{field.heading}</strong>
        <ul>
          {paper.review[field.review_key].map(point=> {
            return <li key={point}>{point}</li>;
          })}
        </ul>
      </div>
      );
    })

    return (
        <div>
          <PageHeader tags={this.render_tags(paper.metadata.keywords)} title={paper.metadata.title} onBack={() => this.setState({active_paper: null})} />
          <div>
            {render_comma_sep_list(paper.metadata.authors)}
            {render_comma_sep_list(paper.metadata.institutions)}
            Published in {paper.metadata.journal} in {date_str}
            {` `}
            {doi_tag}
          </div>
          <hr />
          {review}
        </div>
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
                  value={this.state.query}
                  allowClear
                />
              </div>
              <div>
                <Select
                  defaultValue="review-date-descending"
                  style={{ width: 220 }}
                  id="sort_input"
                  onChange={(e) => {this.setState({sort_mode: e})}}
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
    if (this.state.active_paper){
      to_render = this.render_review(this.state.active_paper)
    }

    return (
      <div>
        {to_render}
      </div>
    );
  }
}

export default ReviewReader;

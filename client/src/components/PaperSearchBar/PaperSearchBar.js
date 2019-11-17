import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, Button, Input, PageHeader } from "antd";
import { start_review } from "../../actions/index";
import _ from "lodash";
import { render_comma_sep_list, capital_case } from "../utils.js";
import "./PaperSearchBar.css";

const cognitiveServices = require("cognitive-services");

class PaperSearchBar extends Component {
  constructor(props) {
    super(props);

    // debounce search to avoid repeated calls to API
    this.academicSearchThrottled = _.debounce(this.academicSearch, 200);

    this.state = {
      query: "",
      entities: []
    };
  }

  async academicSearch(query) {
    // bail out if no query
    if (query.length === 0) {
      return;
    }

    const attrs = "DN,D,DOI,AA.AfN,AA.AuN,J.JN,S,Y,Id";
    let interpret_query = `https://api.labs.cognitive.microsoft.com/academic/v1.0/interpret?query=${query}&count=1&subscription-key=${process.env.REACT_APP_MSCOG_KEY1}`;
    fetch(interpret_query)
      .then(response => response.json())
      .then(data => {
        console.log("success!");
        console.log(JSON.stringify(data));

        if (data.interpretations.length === 0) {
          this.setState({ entities: [] });
          return;
        } else {
          console.log(data.interpretations);
          var top_interpretation =
            data.interpretations[0].rules[0].output.value;
          var eval_query = `https://api.labs.cognitive.microsoft.com/academic/v1.0/evaluate?expr=${top_interpretation}&count=5&subscription-key=${process.env.REACT_APP_MSCOG_KEY1}&attributes=${attrs}`;
          fetch(eval_query)
            .then(response => response.json())
            .then(data => {
              this.setState({ entities: data.entities });
            });
        }
      });
  }

  handleSearch = search_term => {
    if (search_term === "") {
      this.setState({
        entities: [],
        query: search_term
      });
      return;
    }

    // update searchbar value, start spinner, and only then run the search
    this.setState(
      {
        query: search_term
      },
      () => {
        this.academicSearchThrottled(search_term);
      }
    );
  };

  processEntity(paperid) {
    // find the provided ID in entities
    let ent = _.find(this.state.entities, { Id: paperid });
    console.log(ent);

    // sort authors by position (first author first, etc)
    let authors = _.sortBy(ent.AA, [
      function(o) {
        return o.S;
      }
    ]);

    // filter down to unique authors and remove empty entries
    let author_names = _.uniq(
      authors.map(author => {
        return capital_case(author.AuN.split(".").join(""));
      })
    ).filter(name => name !== "");

    // filter down to unique institutions and remove empty entries
    let institutions = _.uniq(
      authors.map(author => {
        return capital_case(author.AfN)
          .split(".")
          .join("")
          .trim();
      })
    ).filter(name => name !== "");

    if (author_names === undefined || author_names.length === 0) {
      author_names = [""];
    }

    if (institutions === undefined || institutions.length === 0) {
      institutions = [""];
    }

    // dispatch action to begin the review
    console.log(ent);
    const review = {
      metadata: {
        title: capital_case(ent.DN),
        authors: author_names,
        institutions: institutions,
        date: new Date(ent.D),
        doi: "",
        journal: ent.JN,
        url: ""
      },
      review: {
        summary_points: [""],
        background_points: [""],
        approach_points: [""],
        results_points: [""],
        conclusions_points: [""],
        other_points: [""]
      }
    };
    return review;
  }

  handlePaperClick = paperid => {
    let review = this.processEntity(paperid);
    this.props.dispatch(start_review(review));

    // reset the search bar and results
    this.setState({
      query: "",
      entities: []
    });
  };

  addToReadingList = paperid => {
    let review = this.processEntity(paperid);
    this.props.addToReadingListHandler(review);
  };

  renderHits() {
    const rendered_entities = this.state.entities.map(ent => {
      console.log(ent);
      let authors = ent.AA;

      // sort by author order
      authors = _.sortBy(authors, [
        function(o) {
          return o.S;
        }
      ]);

      let unique_authors = _.uniqBy(authors, "AuN");
      let author_names = unique_authors.map(author => {
        return capital_case(author.AuN);
      });

      let author_names_list = render_comma_sep_list(
        author_names,
        "author_results"
      );
      let journal_name = ent.JN ? ent.JN + ", " : "";
      let year = ent.Y;

      return (
        <div
          className="searchResult"
          key={ent.Id}
          onClick={() => {
            this.addToReadingList(ent.Id);
          }}
        >
          <div
            style={{
              width: "100%"
            }}
          >
            <div>
              <strong>{capital_case(ent.DN)}</strong>
              <br />
              {author_names_list}
            </div>
          </div>
          <em>
            {journal_name}
            {year}
          </em>
          <div>
            <Button
              size="small"
              onClick={e => {
                e.stopPropagation();
                this.handlePaperClick(ent.Id);
              }}
            >
              Start Review Now <Icon type="form" />
            </Button>
          </div>
        </div>
      );
    });

    return <div>{rendered_entities}</div>;
  }

  render() {
    const { carousel } = this.props;

    const search_area = (
      <div>
        <div>
          <PageHeader
            title="Write a Review"
            subTitle="Search online for papers"
            avatar={{ icon: "file-search" }}
          />
        </div>
        <Input
          type="text"
          width="50%"
          onChange={e => this.handleSearch(`${e.target.value}`)}
          placeholder="e.g., Retinal waves nature 2012"
          value={this.state.query}
          allowClear
        />
      </div>
    );

    let results = this.state.entities.length ? this.renderHits() : carousel;

    return (
      <div>
        <br />
        {search_area}
        {results}
      </div>
    );
  }
}

export default connect()(PaperSearchBar);

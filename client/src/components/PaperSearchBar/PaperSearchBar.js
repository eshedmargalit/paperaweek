import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, Button, Input, PageHeader } from "antd";
import { start_review } from "../../actions/index";
import { BeatLoader } from "react-spinners";
import _ from "lodash";
import { render_comma_sep_list, capital_case } from "../utils.js";

class PaperSearchBar extends Component {
  constructor(props) {
    super(props);

    // debounce search to avoid repeated calls to API
    this.ms_search_throttled = _.debounce(this.ms_search, 200);

    this.state = {
      query: "",
      date: new Date(),
      entities: [],
      author_names: [""],
      institution_names: [""],
      keywords: [""],
      summary_points: [""],
      background_points: [""],
      approach_points: [""],
      results_points: [""],
      conclusions_points: [""],
      other_points: [""]
    };
  }

  async ms_search(query) {
    if (query.length === 0) {
      this.setState({ resultsAreLoading: false });
      return;
    }

    const cognitiveServices = require("cognitive-services");

    const client = new cognitiveServices.academicKnowledge({
      apiKey: process.env.REACT_APP_MSCOG_KEY1,
      endpoint: "api.labs.cognitive.microsoft.com"
    });

    var parameters = {
      query: query
    };

    var response = client.interpret({
      parameters
    });
    var resp = await response;

    if (resp.interpretations.length === 0) {
      this.setState({ resultsAreLoading: false });
      return;
    }
    var value = resp.interpretations[0].rules[0].output.value;

    // attributes, in order, are: Author name, author order, DOI, Paper name, Journal Name, Affilitation display name, publication year, publication date
    parameters = {
      expr: value,
      attributes: "AA.DAuN,AA.AfN,AA.S,E.DOI,E.DN,E.BV,E.S,Y,D",
      count: 5
    };

    response = client.evaluate({
      parameters
    });

    resp = await response;

    this.setState({
      entities: resp.entities,
      resultsAreLoading: false
    });
  }

  handleSearch = search_term => {
    if (search_term === "") {
      this.setState({
        entities: [],
        resultsAreLoading: false,
        query: search_term
      });
      return;
    }

    this.setState(
      {
        query: search_term,
        resultsAreLoading: true
      },
      () => {
        this.ms_search_throttled(search_term);
      }
    );
  };

  handlePaperClick = paperid => {
    // find the provided ID in entities
    let ent = _.find(this.state.entities, { Id: paperid });

    let authors = _.sortBy(ent.AA, [
      function(o) {
        return o.S;
      }
    ]);

    let author_names = _.uniq(
      authors.map(author => {
        return author.DAuN;
      })
    ).filter(name => name !== "");

    let institutions = _.uniq(
      authors.map(author => {
        return capital_case(author.AfN);
      })
    ).filter(name => name !== "");

    const paper_metadata = {
      title: ent.DN,
      author_names: author_names,
      institution_names: institutions,
      date: new Date(ent.D),
      doi: ent.DOI,
      journal: ent.BV,
      url: ent.S ? ent.S[0].U : ""
    };

    this.props.dispatch(start_review(paper_metadata));

    this.setState({
      query: "",
      entities: []
    });
  };

  renderHits() {
    const lg_items = this.state.entities.map(ent => {
      let authors = ent.AA;

      // sort by author order
      authors = _.sortBy(authors, [
        function(o) {
          return o.S;
        }
      ]);

      let unique_authors = _.uniqBy(authors, "DAuN");
      let author_names = unique_authors.map(author => {
        return author.DAuN;
      });

      let author_names_list = render_comma_sep_list(
        author_names,
        "author_results"
      );
      let journal_name = ent.BV + ", ";
      let year = ent.Y;

      return (
        <div
          style={{
            border: "1px solid gray",
            borderRadius: "5px",
            marginTop: "5px",
            padding: "10px"
          }}
          key={ent.Id}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between"
            }}
          >
            <div>
              <strong>{ent.DN}</strong>
              <br />
              {author_names_list}
            </div>
            <div>
              <Button
                onClick={() => {
                  this.handlePaperClick(ent.Id);
                }}
              >
                Start Review <Icon type="form" />
              </Button>
            </div>
          </div>
          <em>
            {journal_name}
            {year}
          </em>
        </div>
      );
    });

    return <div>{lg_items}</div>;
  }

  render() {
    let spinner = null;
    if (this.state.resultsAreLoading) {
      spinner = (
        <div>
          Searching <BeatLoader size={4} />
        </div>
      );
    }

    const directory = (
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
        {spinner}
      </div>
    );

    let results = null;
    if (this.state.entities.length > 0) {
      results = this.renderHits();
    }

    return (
      <div>
        <br />
        {directory}
        {results}
      </div>
    );
  }
}

export default connect()(PaperSearchBar);

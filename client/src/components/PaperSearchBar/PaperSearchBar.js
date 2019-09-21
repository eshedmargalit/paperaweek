import React, { Component } from "react";
import { connect } from "react-redux";
import { Carousel, Icon, Button, Input, PageHeader } from "antd";
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

    try {
      var resp = await response;
    } catch (error) {
      console.error(error);
    }

    if (resp.interpretations.length === 0) {
      this.setState({ entities: [] });
      return;
    }
    var value = resp.interpretations[0].rules[0].output.value;

    // Attributes:
    // key     | meaning
    // -----------------
    // AA.DAuN | Author Name
    // AA.AfN  | Author affiliation
    // AA.S    | Author position
    // E.DOI   | Paper DOI
    // E.DN    | Paper title
    // E.BV    | Journal name
    // E.S     | Paper source
    // Y       | Paper year
    // D       | Paper publication date
    // See https://docs.microsoft.com/en-us/academic-services/knowledge-exploration-service/reference-entity-api for other fields
    parameters = {
      expr: value,
      attributes: "AA.DAuN,AA.AfN,AA.S,E.DOI,E.DN,E.BV,E.S,Y,D",
      count: 5
    };
    response = client.evaluate({
      parameters
    });
    try {
      resp = await response;
    } catch (error) {
      console.error(error);
      resp.entities = [];
    }

    this.setState({
      entities: resp.entities
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

    // sort authors by position (first author first, etc)
    let authors = _.sortBy(ent.AA, [
      function(o) {
        return o.S;
      }
    ]);

    // filter down to unique authors and remove empty entries
    let author_names = _.uniq(
      authors.map(author => {
        return author.DAuN.split(".").join("");
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
    const review = {
      metadata: {
        title: ent.DN,
        authors: author_names,
        institutions: institutions,
        date: new Date(ent.D),
        doi: ent.DOI,
        journal: ent.BV,
        url: ent.S ? ent.S[0].U : ""
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
      let journal_name = ent.BV ? ent.BV + ", " : "";
      let year = ent.Y;

      return (
        <div
          style={{
            border: "1px solid lightgray",
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Button
                  onClick={() => {
                    this.handlePaperClick(ent.Id);
                  }}
                >
                  Start Review <Icon type="form" />
                </Button>
              </div>

              <div style={{ marginLeft: "5px" }}>
                <Button
                  onClick={() => {
                    this.addToReadingList(ent.Id);
                  }}
                  icon="plus"
                />
              </div>
            </div>
          </div>
          <em>
            {journal_name}
            {year}
          </em>
        </div>
      );
    });

    return <div>{rendered_entities}</div>;
  }

  render() {
    const carouselContent = [
      "A paper a week keeps the literature review on fleek",
      "Believe first and foremost in yourself!",
      "I'm trapped in here, please help me! It's been weeks...",
      "Reading papers is fun AND nutritious! 🤪"
    ];
    const filler = (
      <Carousel autoplay speed={1000}>
        {carouselContent.map(item => {
          return <h3 key={`carousel ${item}`}>{item}</h3>;
        })}
      </Carousel>
    );

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

    let results = this.state.entities.length ? this.renderHits() : filler;

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

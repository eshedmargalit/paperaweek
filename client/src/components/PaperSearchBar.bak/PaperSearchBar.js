import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button, Input, PageHeader } from 'antd';
import { startReview } from '../../actions/index';
import _ from 'lodash';
import { render_comma_sep_list, capital_case } from '../utils.js';
import './PaperSearchBar.scss';

const endpoint = 'https://api.labs.cognitive.microsoft.com/academic/v1.0';

class PaperSearchBar extends Component {
  constructor(props) {
    super(props);

    // debounce search to avoid repeated calls to API
    this.academicSearchThrottled = _.debounce(this.academicSearch, 200);

    this.state = {
      query: '',
      entities: [],
    };
  }

  async interpret(query) {
    let interpret_query = `${endpoint}/interpret?query=${query}&complete=1&count=1&subscription-key=${process.env.REACT_APP_MSCOG_KEY1}`;

    let response = await fetch(interpret_query);
    let data = await response.json();
    return data;
  }

  async evaluate(interpretation, attrs) {
    let eval_query = `${endpoint}/evaluate?expr=${interpretation}&count=5&subscription-key=${process.env.REACT_APP_MSCOG_KEY1}&attributes=${attrs}`;

    let response = await fetch(eval_query);
    let data = await response.json();
    return data;
  }

  async academicSearch(query) {
    // bail out if no query
    if (query.length === 0) {
      return;
    }

    const attrs = 'DN,D,DOI,AA.DAfN,AA.DAuN,S,Y,Id,VFN';
    // Attributes:
    // key     | meaning
    // -----------------
    // DN      | 'Display Name' (Title)
    // D       | Date
    // DOI     | Digital Object Identifier
    // AA.DAfN | Author Affiliation
    // AA.DAuN | Author Name
    // S       | Sources (includes URLs)
    // Y       | Year (should be part of D but whatever)
    // Id      | Unique identifier for entity
    // VFN    | Journal Name
    // See https://docs.microsoft.com/en-us/academic-services/knowledge-exploration-service/reference-entity-api for other fields
    let interpret_response = await this.interpret(query, attrs);
    if (interpret_response.interpretations.length === 0) {
      this.setState({ entities: [] });
      return;
    } else {
      var top_interpretation = interpret_response.interpretations[0].rules[0].output.value;
      for (let i = 0; i < interpret_response.interpretations.length; i++) {}
      let evaluate_response = await this.evaluate(top_interpretation, attrs);
      this.setState({ entities: evaluate_response.entities });
    }
  }

  handleSearch = search_term => {
    if (search_term === '') {
      this.setState({
        entities: [],
        query: search_term,
      });
      return;
    }

    // update searchbar value, start spinner, and only then run the search
    this.setState(
      {
        query: search_term,
      },
      () => {
        this.academicSearchThrottled(search_term);
      }
    );
  };

  processEntity(paperid) {
    // find the provided ID in entities
    let entity = _.find(this.state.entities, { Id: paperid });
    console.log(entity);

    // sort authors by position (first author first, etc)
    let authors = _.sortBy(entity.AA, [
      function(o) {
        return o.S;
      },
    ]);

    // filter down to unique authors and remove empty entries
    let author_names = _.uniq(
      authors.map(author => {
        return capital_case(author.DAuN.split('.').join(''));
      })
    ).filter(name => name !== '');

    // filter down to unique institutions and remove empty entries
    let institutions = _.uniq(
      authors.map(author => {
        return capital_case(author.DAfN)
          .split('.')
          .join('')
          .trim();
      })
    ).filter(name => name !== '');

    if (author_names === undefined || author_names.length === 0) {
      author_names = [''];
    }

    if (institutions === undefined || institutions.length === 0) {
      institutions = [''];
    }

    let entity_url = '';
    if (entity.S.length !== 0) {
      entity_url = entity.S[0].U;
    }

    let journal_name = entity.VFN ? entity.VFN : '';

    // dispatch action to begin the review
    const paper = {
      title: entity.DN,
      authors: author_names,
      institutions: institutions,
      date: new Date(entity.D),
      doi: entity.DOI,
      journal: journal_name,
      url: entity_url,
    };
    const review = {
      paper: paper,
      review: null,
    };
    return review;
  }

  async handlePaperClick(paperid) {
    let reviewContent = this.processEntity(paperid);
    this.props.dispatch(startReview(null, reviewContent));

    // reset the search bar and results
    this.setState({
      query: '',
      entities: [],
    });
  }

  addToReadingList = paperid => {
    let review = this.processEntity(paperid);
    let newId = this.props.addToReadingListHandler(review);
    return newId;
  };

  renderHits() {
    const rendered_entities = this.state.entities.map(entity => {
      let authors = entity.AA;

      // sort by author order
      authors = _.sortBy(authors, [
        function(o) {
          return o.S;
        },
      ]);

      let unique_authors = _.uniqBy(authors, 'DAuN');
      let author_names = unique_authors.map(author => {
        return capital_case(author.DAuN);
      });

      let author_names_list = render_comma_sep_list(author_names, 'author_results');
      let journal_name = entity.VFN ? entity.VFN : '';

      let year = entity.Y;

      return (
        <div
          className="searchResult"
          key={entity.Id}
          onClick={() => {
            this.addToReadingList(entity.Id);
          }}
        >
          <div className="paperSearch__result">
            <div>
              <strong>{entity.DN}</strong>
              <br />
              {author_names_list}
            </div>
          </div>
          <em>
            {journal_name}
            {` `}
            {year}
          </em>
          <div>
            <Button
              size="small"
              onClick={e => {
                e.stopPropagation();
                this.handlePaperClick(entity.Id);
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
          <PageHeader title="Write a Review" subTitle="Search online for papers" avatar={{ icon: 'file-search' }} />
        </div>
        <div className="paperSearch__input">
          <Input
            type="text"
            width="50%"
            onChange={e => this.handleSearch(`${e.target.value}`)}
            placeholder="e.g., Retinal waves nature 2012"
            value={this.state.query}
            allowClear
          />
          <Button onClick={this.props.startBlankReview}>
            Create Manual Entry <Icon type="plus-circle" />
          </Button>
        </div>
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

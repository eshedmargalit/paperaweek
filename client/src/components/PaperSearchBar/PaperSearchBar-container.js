import React, { Component } from 'react';
import axios from 'axios';
import PaperSearchBarView from './PaperSearchBar-view';

import _ from 'lodash';
import { capital_case } from '../utils';

class PaperSearchBarContainer extends Component {
  constructor(props) {
    super(props);

    // debounce search to avoid repeated calls to API
    this.academicSearchThrottled = _.debounce(this.academicSearch, 350);
    this.handleSearch.bind(this);

    this.state = {
      query: '',
      loading: false,
      searchResults: [],
    };
  }

  async interpret(query) {
    const response = await axios(`api/searchBar/interpret/${query}`);
    return response.data;
  }

  async evaluate(interpretation, attrs) {
    const response = await axios(`api/searchBar/evaluate/${interpretation}/${attrs}`);
    // let data = await response.json();
    // return data;
    return response.data;
  }

  async academicSearch(query) {
    // sanitize query
    // replacing with spaces
    query = query.replace(/[-_]/g, ' ').toLowerCase();

    // deleting
    query = query.replace(/['"\/\\]/g, '');

    // bail out if no query
    if (query.length === 0) {
      this.setState({ searchResults: [], loading: false });
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
    this.setState({ loading: true });
    let interpret_response = await this.interpret(query, attrs);
    let interpretations = interpret_response.interpretations;
    if (!interpretations || !interpretations.length) {
      this.setState({ searchResults: [], loading: false });
    } else {
      var top_interpretation = interpret_response.interpretations[0].rules[0].output.value;
      let evaluate_response = await this.evaluate(top_interpretation, attrs);
      let searchResults = this.processEntities(evaluate_response.entities);
      this.setState({ searchResults, loading: false });
    }
  }

  processEntities = entities => {
    let searchResults = entities.map(entity => {
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
      if (entity.S && entity.S.length !== 0) {
        entity_url = entity.S[0].U;
      }

      let journal_name = entity.VFN ? entity.VFN : '';

      const paper = {
        title: entity.DN,
        authors: author_names,
        institutions: institutions,
        date: new Date(entity.D),
        doi: entity.DOI,
        journal: journal_name,
        url: entity_url,
      };
      return { paper: paper, id: entity.Id };
    });
    return searchResults;
  };

  handleSearch = searchTerm => {
    this.academicSearchThrottled.cancel();

    if (searchTerm === '') {
      this.setState({
        loading: false,
        searchResults: [],
        query: searchTerm,
      });
      return;
    }

    // update searchbar value and only then run the search
    this.setState(
      {
        loading: true,
        query: searchTerm,
      },
      () => {
        this.academicSearchThrottled(searchTerm);
      }
    );
  };

  render() {
    return (
      <PaperSearchBarView
        handleSearch={this.handleSearch}
        handleClickResult={this.props.handleClickResult}
        handleClickResultButton={this.props.handleClickResultButton}
        searchResults={this.state.searchResults}
        startBlankReview={this.props.startBlankReview}
        loading={this.state.loading}
        query={this.state.query}
      />
    );
  }
}

export default PaperSearchBarContainer;

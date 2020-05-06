import React, { Component } from 'react';
import axios from 'axios';
import PaperSearchBarView from './PaperSearchBar-view';

import _ from 'lodash';

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

    this.setState({ loading: true });
    let searchResults = await this.interpret(query);
    this.setState({ searchResults, loading: false });
  }

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

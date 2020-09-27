import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PaperSearchBarView from './PaperSearchBar-view';
import { isDOI } from '../utils';

import _ from 'lodash';

const interpret = async query => {
  // first regex to replace any dashes or underscores with a space
  query = query.replace(/[-_]/g, ' ').toLowerCase();

  // second regex to delete single quotes, double quotes, and slashes
  query = query.replace(/['"\/\\]/g, '');

  const response = await axios(`api/searchBar/interpret/${query}`);
  return response.data;
};

const doiSearch = async query => {
  if (query.includes('doi.org')) {
    // catches both doi.org and dx.doi.org
    query = new URL(query).pathname.substr(1);
  }

  if (query.split('/').length < 2) {
    return [];
  }

  let doiResp = null;
  try {
    doiResp = await axios.get(`/api/doi/${query}`);
    return [doiResp.data];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export default function PaperSearchBarContainer({ setBlankReview, handleClickResult, handleClickResultButton }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const academicSearch = async searchQuery => {
    // bail out if no query
    if (searchQuery.length === 0) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // if searchQuery looks like a DOI, call that API instead of interpretation
    const apiCall = isDOI(searchQuery) ? doiSearch : interpret;
    const searchResults = await apiCall(searchQuery);
    setSearchResults(searchResults);
    setLoading(false);
  };

  // need to use useCallback here so that debounce always returns the same object;
  // otherwise we get infinite re-renders with useEffect
  const academicSearchThrottled = useCallback(_.debounce(academicSearch, 800), []);

  const handleSearch = searchTerm => {
    academicSearchThrottled.cancel();
    setQuery(searchTerm);

    // bail out if search is empty
    if (searchTerm === '') {
      setLoading(false);
      setSearchResults([]);
      return;
    }

    // update searchbar value and only then run the search
    setLoading(true);
  };

  // search when query changes
  useEffect(() => {
    if (query !== '') {
      academicSearchThrottled(query);
    }
  }, [query, academicSearchThrottled]);

  return (
    <PaperSearchBarView
      handleSearch={handleSearch}
      handleClickResult={handleClickResult}
      handleClickResultButton={handleClickResultButton}
      searchResults={searchResults}
      setBlankReview={setBlankReview}
      loading={loading}
      query={query}
    />
  );
}

import axios from 'axios';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { constructPaperFromResponse, PaperResponse } from '../../dtos';
import { Paper } from '../../types';
import PaperSearchBarView from './PaperSearchBar-view';

const paperSearch = async (input: string): Promise<Paper[]> => {
  try {
    const { data } = await axios.get<PaperResponse[]>(`/api/search/${input}`);
    return data.map(constructPaperFromResponse);
  } catch (err) {
    console.error(err);
    return [];
  }
};

interface PaperSearchBarContainerProps {
  setBlankReview: () => void;
  handleReadingListAdd: (paper: Paper) => void;
  handleStartReview: (paper: Paper) => void;
}

export default function PaperSearchBarContainer({
  setBlankReview,
  handleReadingListAdd,
  handleStartReview,
}: PaperSearchBarContainerProps): JSX.Element {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Paper[]>([]);

  const academicSearch = async (searchQuery: string): Promise<void> => {
    // bail out if no query
    if (searchQuery.length === 0) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // if searchQuery looks like a DOI, call that API. Otherwise short-circuit to no results
    const resultPapers: Paper[] = await paperSearch(searchQuery);
    setSearchResults(resultPapers);
    setLoading(false);
  };

  // need to use useCallback here so that debounce always returns the same object;
  // otherwise we get infinite re-renders with useEffect
  const academicSearchThrottled = useCallback(_.debounce(academicSearch, 800), []);

  const handleSearch = (searchTerm: string): void => {
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
      handleReadingListAdd={handleReadingListAdd}
      handleStartReview={handleStartReview}
      searchResults={searchResults}
      setBlankReview={setBlankReview}
      loading={loading}
      query={query}
    />
  );
}

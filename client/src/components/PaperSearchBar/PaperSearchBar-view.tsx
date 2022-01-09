import { FileSearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Input, PageHeader, Row, Spin } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { Paper } from '../../types';

import './PaperSearchBar.scss';
import SearchResult from './SearchResult';

const renderSearchResults = (
  searchResults: Paper[],
  handleReadingListAdd: (paper: Paper) => void,
  handleStartReview: (paper: Paper) => void
) => {
  const renderedSearchResults = searchResults.map((result: Paper) => (
    <span key={result.title}>
      <SearchResult result={result} handleReadingListAdd={handleReadingListAdd} handleStartReview={handleStartReview} />
    </span>
  ));

  return renderedSearchResults.length ? (
    renderedSearchResults
  ) : (
    <Alert
      className="no-results-alert"
      message="No Results Found"
      description="We support searching by DOI, keywords in the paper title, or by author name."
      type="info"
      showIcon
    />
  );
};

export interface PaperSearchBarViewProps {
  handleSearch: (searchTerm: string) => void;
  handleReadingListAdd: (paper: Paper) => void;
  handleStartReview: (paper: Paper) => void;
  setBlankReview: () => void;
  searchResults: Paper[];
  loading: boolean;
  query: string;
}

export default function PaperSearchBarView({
  handleSearch,
  handleReadingListAdd,
  handleStartReview,
  setBlankReview,
  searchResults,
  loading,
  query,
}: PaperSearchBarViewProps): JSX.Element {
  const renderedSearchResults = renderSearchResults(searchResults, handleReadingListAdd, handleStartReview);
  const searchArea = (
    <div>
      <div>
        <PageHeader title="Write a Review" avatar={{ icon: <FileSearchOutlined /> }} />
      </div>
      <div>
        <Row gutter={[16, 16]}>
          <Col lg={16} sm={24} xs={24}>
            <Input
              type="text"
              onChange={(e) => handleSearch(`${e.target.value}`)}
              placeholder="search by title, DOI, or author"
              value={query}
              allowClear
            />
          </Col>
          <Col lg={8} sm={24} xs={24}>
            <Button style={{ width: '100%' }} onClick={setBlankReview}>
              <Link to="/form">
                {' '}
                Create Manual Entry <PlusCircleOutlined />
              </Link>
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );

  const resultsToDisplay = query === '' ? null : renderedSearchResults;

  return (
    <div className="paper-searchbar">
      {searchArea}
      {loading ? (
        <Spin data-testid="paper-searchbar-spinner" className="searchResult loading-spinner" />
      ) : (
        resultsToDisplay
      )}
    </div>
  );
}

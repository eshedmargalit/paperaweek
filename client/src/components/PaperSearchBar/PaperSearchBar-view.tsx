import { FileSearchOutlined, FormOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Input, PageHeader, Popover, Row, Spin } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { Maybe, Paper } from '../../types';
import StatBox from '../StatBox';
import { removeMiddleAuthors, renderCommaSepList } from '../utils';
import './PaperSearchBar.scss';

const renderSearchResults = (
  searchResults: Paper[],
  handleReadingListAdd: (paper: Paper) => void,
  handleStartReview: (paper: Paper) => void
) => {
  const renderedSearchResults = searchResults.map((result: Paper) => {
    const { title, journal, date, authors } = result;
    const year: Maybe<number> = date ? new Date(date).getFullYear() : null;
    const renderedAuthorNames = renderCommaSepList(removeMiddleAuthors(authors, 4));

    const popOverContent = (
      <div>
        <Button
          onClick={() => {
            handleReadingListAdd(result);
          }}
        >
          Add to Reading List <PlusOutlined />
        </Button>
        <Link to="/form">
          <Button
            onClick={() => {
              handleStartReview(result);
            }}
          >
            Start Review Now <FormOutlined />
          </Button>
        </Link>
      </div>
    );

    return (
      <Popover content={popOverContent} trigger="click" key={title} placement="right">
        <div className="searchResult">
          <div className="paperSearch__result">
            <div>
              <strong>{title}</strong>
              <br />
              {renderedAuthorNames}
            </div>
          </div>
          <em>
            {journal} {year}
          </em>
          <div />
        </div>
      </Popover>
    );
  });
  return renderedSearchResults;
};

interface PaperSearchBarViewProps {
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
        <PageHeader
          title="Write a Review"
          subTitle="Search online for papers"
          avatar={{ icon: <FileSearchOutlined /> }}
        />
      </div>
      <div>
        <Row gutter={[16, 16]}>
          <Col lg={16} sm={24} xs={24}>
            <Input
              type="text"
              onChange={e => handleSearch(`${e.target.value}`)}
              placeholder="search by DOI, title, author, or journal"
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

  const noResultsAlert = (
    <Alert
      className="no-results-alert"
      message="No Results Found"
      description="Try searching for a different keyword or with simpler terms. If you're searching by DOI, try formatting the query like '10.7554/elife.53798'."
      type="info"
      showIcon
    />
  );

  let searchRender: Maybe<JSX.Element | JSX.Element[]> = null;
  if (query === '') {
    searchRender = <StatBox />;
  } else if (renderedSearchResults.length) {
    searchRender = renderedSearchResults;
  } else {
    searchRender = noResultsAlert;
  }

  return (
    <div>
      <br />
      {searchArea}
      {loading ? <Spin data-testid="paper-searchbar-spinner" className="searchResult loading-spinner" /> : searchRender}
    </div>
  );
}

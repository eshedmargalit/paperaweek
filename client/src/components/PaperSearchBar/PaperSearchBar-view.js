import React from 'react';
import { Alert, Button, Input, PageHeader, Popover, Spin } from 'antd';
import { FileSearchOutlined, PlusOutlined, PlusCircleOutlined, FormOutlined } from '@ant-design/icons';

import { render_comma_sep_list, removeMiddleAuthors } from '../utils';
import StatBox from '../StatBox';
import './PaperSearchBar.scss';

const renderSearchResults = (searchResults, handleClickResult, handleClickResultButton) => {
  const renderedSearchResults = searchResults.map(result => {
    let { paper, id } = result;
    let { title, journal, date, authors } = paper;
    let year = new Date(date).getFullYear();
    let author_names_list = render_comma_sep_list(removeMiddleAuthors(authors, 4), 'author_names');

    const popOverContent = (
      <div>
        <Button
          onClick={() => {
            handleClickResult(result);
          }}
        >
          Add to Reading List <PlusOutlined />
        </Button>
        <Button
          onClick={() => {
            handleClickResultButton(result);
          }}
        >
          Start Review Now <FormOutlined />
        </Button>
      </div>
    );

    return (
      <Popover content={popOverContent} trigger="click" key={id} placement="right">
        <div className="searchResult">
          <div className="paperSearch__result">
            <div>
              <strong>{title}</strong>
              <br />
              {author_names_list}
            </div>
          </div>
          <em>
            {journal}
            {` `}
            {year}
          </em>
          <div></div>
        </div>
      </Popover>
    );
  });
  return renderedSearchResults;
};

function PaperSearchBarView({
  handleSearch,
  handleClickResult,
  handleClickResultButton,
  startBlankReview,
  searchResults,
  loading,
  query,
}) {
  const renderedSearchResults = renderSearchResults(searchResults, handleClickResult, handleClickResultButton);
  const search_area = (
    <div>
      <div>
        <PageHeader
          title="Write a Review"
          subTitle="Search online for papers"
          avatar={{ icon: <FileSearchOutlined /> }}
        />
      </div>
      <div className="paperSearch__input">
        <Input
          type="text"
          width="50%"
          onChange={e => handleSearch(`${e.target.value}`)}
          placeholder="search by DOI, title, author,  or journal"
          value={query}
          allowClear
        />
        <Button onClick={startBlankReview}>
          Create Manual Entry <PlusCircleOutlined />
        </Button>
      </div>
    </div>
  );

  const noResultsAlert = (
    <Alert
      className="no-results-alert"
      message="No Results Found"
      description="Try searching for a different keyword or with simpler terms"
      type="info"
      showIcon
    />
  );

  let searchRender = null;
  if (query === '') {
    searchRender = <StatBox startBlankReview={startBlankReview} />;
  } else {
    if (renderedSearchResults.length) {
      searchRender = renderedSearchResults;
    } else {
      searchRender = noResultsAlert;
    }
  }

  return (
    <div>
      <br />
      {search_area}
      {loading ? <Spin className="searchResult loading-spinner" /> : searchRender}
    </div>
  );
}

export default PaperSearchBarView;

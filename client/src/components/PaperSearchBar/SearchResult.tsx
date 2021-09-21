import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import { Maybe, Paper } from '../../types';

import { PaperSearchBarViewProps } from './PaperSearchBar-view';
import { removeMiddleAuthors, renderCommaSepList } from '../utils';

type SearchResultProps = { result: Paper } & Pick<
  PaperSearchBarViewProps,
  'handleReadingListAdd' | 'handleStartReview'
>;

export default function SearchResult({
  result,
  handleReadingListAdd,
  handleStartReview,
}: SearchResultProps): JSX.Element {
  const { title, journal, date, authors } = result;
  const year: Maybe<number> = date ? new Date(date).getFullYear() : null;
  const renderedAuthorNames = renderCommaSepList(removeMiddleAuthors(authors, 4));

  const [visible, setVisible] = useState(false);
  const toggleVisible = () => setVisible(!visible);
  const popOverContent = (
    <div>
      <Button
        onClick={() => {
          handleReadingListAdd(result);
          setVisible(false);
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
    <Popover
      content={popOverContent}
      trigger="click"
      key={title}
      placement="right"
      visible={visible}
      onVisibleChange={toggleVisible}
    >
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
}

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

  // eslint-disable-next-line testing-library/render-result-naming-convention
  const authorNamesText = renderCommaSepList(removeMiddleAuthors(authors, 4));

  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);
  const popOverContent = (
    <div>
      <Button
        onClick={() => {
          handleReadingListAdd(result);
          setOpen(false);
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
      open={open}
      onOpenChange={toggleOpen}
    >
      <div className="searchResult">
        <div className="paperSearch__result">
          <div>
            <strong>{title}</strong>
            <br />
            {authorNamesText}
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

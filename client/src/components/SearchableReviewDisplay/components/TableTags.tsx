import React from 'react';
import NAText from '../../NAText';
import TagList from '../../TagList';
import { stringArrayHasNonEmpty } from '../../utils';
import { SearchHandler } from '../types';

interface TableTagsProps {
  tags: string[];
  handleSearch: SearchHandler;
}

export default function TableTags({ tags, handleSearch }: TableTagsProps): JSX.Element {
  if (!stringArrayHasNonEmpty(tags)) {
    return <NAText />;
  }

  return (
    <TagList
      tags={tags}
      onClick={(e) => {
        e.stopPropagation();
        const input = e.target as HTMLElement;
        handleSearch(`${input.innerHTML}`);
      }}
    />
  );
}

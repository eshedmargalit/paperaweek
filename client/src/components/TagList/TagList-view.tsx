import React from 'react';
import { Tag } from 'antd';
import './TagList.scss';

interface TagListProps {
  tags: string[];
  onClick?: (e: React.MouseEvent) => void;
}

export default function TagList({ tags, onClick }: TagListProps): JSX.Element {
  const tagList = tags
    .filter(t => t !== '')
    .map(tag => (
      <Tag key={tag} onClick={onClick}>
        {tag}
      </Tag>
    ));
  return <div>{tagList}</div>;
}

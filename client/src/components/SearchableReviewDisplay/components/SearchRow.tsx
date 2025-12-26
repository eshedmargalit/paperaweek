import React from 'react';
import { Col, Input, Row } from 'antd';
import PageHeader, { PageHeaderProps } from '../../utils/PageHeader';
import { ReadOutlined } from '@ant-design/icons';
import { SearchHandler } from '../types';
import './SearchRow.scss';

interface SearchRowProps {
  query: string;
  pageHeaderProps: PageHeaderProps;
  handleSearch: SearchHandler;
}

export default function SearchRow({ query, pageHeaderProps, handleSearch }: SearchRowProps): JSX.Element {
  return (
    <Row className="review-reader">
      <Col lg={8} sm={24}>
        <PageHeader {...pageHeaderProps} avatar={pageHeaderProps.onBack ? undefined : { icon: <ReadOutlined /> }} />
      </Col>
      <Col lg={16} sm={24}>
        <div className="input-search">
          <Input
            type="text"
            onChange={(e) => handleSearch(`${e.target.value}`)}
            placeholder="Filter by title, author, one sentence summary, tags, and more"
            value={query}
            allowClear
          />
        </div>
      </Col>
    </Row>
  );
}

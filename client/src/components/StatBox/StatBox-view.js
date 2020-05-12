import React from 'react';

import { Button, Card, Row } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import FrequencyChart from '../FrequencyChart';

import './StatBox.scss';

function StatBoxView({ reviews, startBlankReview }) {
  const emptyStats = (
    <Card title="Your Stats" style={{ marginTop: 5 }}>
      <Row>
        <p>
          {' '}
          Stats will begin to appear when you have at least 3 reviews written. <strong>{3 - reviews.length}</strong> to
          go!{' '}
        </p>
      </Row>
      <Row>
        <h6> Getting Started </h6>
        <p>
          <strong>Option 1</strong>: Click
          <Button onClick={startBlankReview}>
            Create Manual Entry <PlusCircleOutlined />
          </Button>{' '}
          to start a review from scratch.
        </p>

        <p>
          <strong>Option 2</strong>: Search for topics or authors with the search bar above. Click a result to add it to
          your reading list for later, or "Start Review Now" to begin a review right away.
        </p>
      </Row>
    </Card>
  );

  return reviews.length > 2 ? <div>{FrequencyChart(reviews)}</div> : <div>{emptyStats}</div>;
}

export default StatBoxView;

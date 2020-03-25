import React from 'react';

import { Button, Card, Icon, Row } from 'antd';
import FrequencyChart from '../FrequencyChart';

import './StatBox.scss';

function StatBoxView({ reviews, startBlankReview }) {
  const emptyStats = (
    <Card title="Your Stats" style={{ marginTop: 5 }}>
      <Row>
        <p> It looks like you haven't written any reviews yet! </p>
      </Row>
      <Row>
        <h6> Getting Started </h6>
        <p>
          <strong>Option 1</strong>: Click
          <Button onClick={startBlankReview}>
            Create Manual Entry <Icon type="plus-circle" />
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

  return reviews.length ? <div>{FrequencyChart(reviews)}</div> : <div>{emptyStats}</div>;
}

export default StatBoxView;

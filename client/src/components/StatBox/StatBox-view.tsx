import React from 'react';

import { Button, Card, Row, Col } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import FrequencyChart from '../FrequencyChart';

import './StatBox.scss';
import { Review } from '../../types';

interface StatBoxViewProps {
  reviews: Review[];
  setBlankReview: () => void;
}
export default function StatBoxView({ reviews, setBlankReview }: StatBoxViewProps): JSX.Element {
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
        <Col>
          <h6> Getting Started </h6>
          <p>
            <strong>Option 1</strong>: Click{' '}
            <Button onClick={setBlankReview} size="small">
              <Link to="/form">
                Create Manual Entry <PlusCircleOutlined />
              </Link>
            </Button>{' '}
            to start a review from scratch.
          </p>

          <p>
            <strong>Option 2</strong>: Search for topics or authors with the search bar above. Click a result to add it
            to your reading list for later, or &quot;Start Review Now&quot; to begin a review right away.
          </p>
        </Col>
      </Row>
    </Card>
  );

  if (reviews.length < 3) {
    return <div>{emptyStats}</div>;
  }

  return (
    <div>
      <FrequencyChart reviews={reviews} />
    </div>
  );
}

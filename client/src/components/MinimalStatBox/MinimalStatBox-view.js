import React from 'react';
import { Card, Row } from 'antd';
import { getReviewStats } from '../utils';

function MinimalStatBoxView({ userDisplayName, reviews }) {
  const emptyStats = (
    <Row>
      <p>
        {' '}
        Stats will begin to appear when {userDisplayName} has at least 3 reviews written.{' '}
        <strong>{3 - reviews.length}</strong> to go!{' '}
      </p>
    </Row>
  );

  const minimalStats = <Row>{getReviewStats(reviews)}</Row>;

  const statBox = (
    <Card title={`${userDisplayName}'s Stats`} style={{ marginTop: 5 }}>
      {reviews.length > 2 ? minimalStats : emptyStats}
    </Card>
  );

  return statBox;
}

export default MinimalStatBoxView;

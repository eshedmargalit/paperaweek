import React from 'react';
import { Card, Row, Statistic } from 'antd';
import { getReviewStats } from '../utils';
import { Review } from '../../types';

export interface MinimalStatBoxViewProps {
  userDisplayName?: string;
  reviews: Review[];
}

export default function MinimalStatBoxView({ userDisplayName, reviews }: MinimalStatBoxViewProps): JSX.Element {
  const emptyStats = (
    <Row>
      <p>
        {' '}
        Stats will begin to appear when {userDisplayName} has at least 3 reviews written.{' '}
        <strong>{3 - reviews.length}</strong> to go!{' '}
      </p>
    </Row>
  );

  // destructure if not null, or set all to undefined
  const { numReviews, ppwString, ppwColor } = getReviewStats(reviews) || {};
  const minimalStats = (
    <div style={{ display: 'flex', width: '400px' }}>
      <div style={{ width: '50%' }}>
        <Statistic title="Reviews" value={numReviews} suffix="written" />
      </div>
      <div style={{ width: '50%' }}>
        <Statistic title="Papers per Week" value={ppwString} valueStyle={{ color: ppwColor }} suffix="/ week" />
      </div>
    </div>
  );

  const statBox = (
    <Card title={`${userDisplayName}'s Stats`} style={{ marginTop: 5 }}>
      {reviews.length > 2 ? minimalStats : emptyStats}
    </Card>
  );

  return statBox;
}

import React from 'react';

import { PageHeader } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Review } from '../../types';
import ReviewDisplay from '../ReviewDisplay/ReviewDisplay';

interface ReviewOfTheDayViewProps {
  rotd: Review;
}

const weeksAgo = (review: Review): number => {
  return moment().diff(review.createdAt, 'weeks');
};

export default function ReviewOfTheDayView({ rotd }: ReviewOfTheDayViewProps): JSX.Element {
  const title = 'Review Revisit Rewind';
  const subTitle = `Read ${weeksAgo(rotd)} weeks ago`;
  return (
    <div>
      <PageHeader title={title} subTitle={subTitle} avatar={{ icon: <ClockCircleOutlined /> }} />
      <ReviewDisplay review={rotd} showTitle />
    </div>
  );
}

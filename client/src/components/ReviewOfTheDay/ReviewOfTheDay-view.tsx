import React from 'react';

import { PageHeader } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useMedia } from 'react-media';
import { Review } from '../../types';
import ReviewDisplay from '../ReviewDisplay/ReviewDisplay';
import FadePreview from '../FadePreview/FadePreview';

export interface ReviewOfTheDayViewProps {
  rotd: Review;
}

const weeksAgo = (review: Review): number => {
  return moment().diff(review.createdAt, 'weeks');
};

export default function ReviewOfTheDayView({ rotd }: ReviewOfTheDayViewProps): JSX.Element {
  const title = 'Review Revisit Rewind';

  // Pageheader subtitles look awful on small screens, so we don't bother
  const isSmallScreen = useMedia({ query: '(max-width: 599px)' });
  const subTitle = isSmallScreen ? null : `Read ${weeksAgo(rotd)} weeks ago`;

  return (
    <div>
      <PageHeader title={title} subTitle={subTitle} avatar={{ icon: <ClockCircleOutlined /> }} />
      <FadePreview>
        <ReviewDisplay review={rotd} showTitle />
      </FadePreview>
    </div>
  );
}

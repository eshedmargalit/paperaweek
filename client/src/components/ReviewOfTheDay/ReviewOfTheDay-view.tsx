import React from 'react';

import PageHeader, { PageHeaderProps } from '../utils/PageHeader';
import { Review } from '../../types';
import ReviewDisplay from '../ReviewDisplay/ReviewDisplay';
import FadePreview from '../FadePreview/FadePreview';

export interface ReviewOfTheDayViewProps {
  rotd: Review;
  pageHeaderProps: PageHeaderProps;
}

export default function ReviewOfTheDayView({ rotd, pageHeaderProps }: ReviewOfTheDayViewProps): JSX.Element {
  return (
    <div className="review-of-the-day">
      <PageHeader {...pageHeaderProps} />
      <FadePreview>
        <ReviewDisplay review={rotd} showTitle />
      </FadePreview>
    </div>
  );
}

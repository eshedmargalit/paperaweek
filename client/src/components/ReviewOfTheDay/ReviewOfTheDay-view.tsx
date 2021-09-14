import React from 'react';

import { PageHeader } from 'antd';
import { PageHeaderProps } from 'antd/lib/page-header';
import { Review } from '../../types';
import ReviewDisplay from '../ReviewDisplay/ReviewDisplay';
import FadePreview from '../FadePreview/FadePreview';

export interface ReviewOfTheDayViewProps {
  rotd: Review;
  pageHeaderProps: PageHeaderProps;
}

export default function ReviewOfTheDayView({ rotd, pageHeaderProps }: ReviewOfTheDayViewProps): JSX.Element {
  return (
    <div>
      <PageHeader {...pageHeaderProps} />
      <FadePreview>
        <ReviewDisplay review={rotd} showTitle />
      </FadePreview>
    </div>
  );
}

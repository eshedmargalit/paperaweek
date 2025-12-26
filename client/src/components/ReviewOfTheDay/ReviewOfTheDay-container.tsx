import { ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import React from 'react';
import { useMedia } from 'react-media';
import { PageHeaderProps } from '../utils/PageHeader';
import { Review } from '../../types';
import ReviewOfTheDayView from './ReviewOfTheDay-view';

interface ReviewOfTheDayContainerProps {
  rotd: Review;
}

export default function ReviewOfTheDayContainer({ rotd }: ReviewOfTheDayContainerProps): JSX.Element {
  const weeksAgo = (review: Review): number => {
    return moment().diff(review.createdAt, 'weeks');
  };

  const title = 'Review Rewind';

  // Pageheader subtitles look awful on small screens, so we don't bother
  const isSmallScreen = useMedia({ query: '(max-width: 599px)' });
  const subTitle = isSmallScreen ? undefined : `You wrote these notes ${weeksAgo(rotd)} weeks ago`;
  const avatar = { icon: <ClockCircleOutlined /> };
  const pageHeaderProps: PageHeaderProps = {
    title,
    subTitle,
    avatar,
  };

  return <ReviewOfTheDayView rotd={rotd} pageHeaderProps={pageHeaderProps} />;
}

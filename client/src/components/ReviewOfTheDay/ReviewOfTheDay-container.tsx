import React from 'react';
import ReviewOfTheDayView, { ReviewOfTheDayViewProps } from './ReviewOfTheDay-view';

type ReviewOfTheDayContainerProps = ReviewOfTheDayViewProps;

export default function ReviewOfTheDayContainer(props: ReviewOfTheDayContainerProps): JSX.Element {
  return <ReviewOfTheDayView {...props} />;
}

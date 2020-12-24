import React from 'react';
import ReadingListView, { ReadingListViewProps } from './ReadingList-view';

type ReadingListContainerProps = ReadingListViewProps;

export default function ReadingListContainer(props: ReadingListContainerProps): JSX.Element {
  return <ReadingListView {...props} />;
}

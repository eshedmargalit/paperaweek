import './PublicProfile.scss';
import React from 'react';

import { Row, Col, Spin } from 'antd';
import { PageHeaderProps } from 'antd/lib/page-header';
import NotFound from '../NotFound/NotFound';

import SearchableReviewDisplay from '../SearchableReviewDisplay';
import MinimalStatBox from '../MinimalStatBox';
import Preferences from '../Preferences';
import { Maybe, Profile, Review } from '../../types';

export interface PublicProfileViewProps extends Partial<Profile> {
  loading: boolean;
  reviewIdToOpen: Review['_id'];
  onChange: VoidFunction;
}

export default function PublicProfileView({
  loading,
  userDisplayName,
  reviews,
  reviewIdToOpen,
  isOwnPage,
  onChange,
}: PublicProfileViewProps): JSX.Element {
  const pageHeaderProps: PageHeaderProps = {
    title: `${userDisplayName}'s Reviews`,
  };

  const preferences: Maybe<JSX.Element> = isOwnPage ? (
    <div>
      <Row>
        <Col span={24}>
          <Preferences onChange={onChange} />
        </Col>
      </Row>
    </div>
  ) : null;

  // map reviewId to review
  const reviewToOpen: Review | undefined = reviews ? reviews.find(review => review._id === reviewIdToOpen) : undefined;

  const profileView: JSX.Element = reviews ? (
    <div className="public-profile">
      <Row>
        <Col span={24}>
          <MinimalStatBox userDisplayName={userDisplayName} reviews={reviews} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <SearchableReviewDisplay
            reviews={reviews}
            reviewToOpen={reviewToOpen}
            pageHeaderProps={pageHeaderProps}
            hideFooter
          />
        </Col>
      </Row>
    </div>
  ) : (
    <NotFound />
  );

  const toRender = loading ? <Spin /> : profileView;
  return (
    <div className="width80">
      {preferences}
      {toRender}
    </div>
  );
}

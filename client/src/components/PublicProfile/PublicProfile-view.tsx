import './PublicProfile.scss';
import React from 'react';

import { Row, Col, Spin, Alert } from 'antd';
import { PageHeaderProps } from 'antd/lib/page-header';
import NotFound from '../NotFound/NotFound';

import SearchableReviewDisplay from '../SearchableReviewDisplay';
import MinimalStatBox from '../MinimalStatBox';
import ProfileHeader from '../ProfileHeader';
import { Profile, Review } from '../../types';

export interface PublicProfileViewProps extends Partial<Profile> {
  loading: boolean;
  reviewIdToOpen: Review['_id'];
  onChange: VoidFunction;
  isOwnPage: Profile['isOwnPage'];
  userDisplayName: Profile['userDisplayName'];
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

  const profileHeader: JSX.Element = (
    <div>
      <Row>
        <Col span={24}>
          <ProfileHeader onChange={onChange} isOwnPage={isOwnPage} userDisplayName={userDisplayName} />
        </Col>
      </Row>
    </div>
  );

  // map reviewId to review
  const reviewToOpen: Review | undefined = reviews ? reviews.find(review => review._id === reviewIdToOpen) : undefined;

  const PrivacyExplainer = (): JSX.Element => {
    return (
      <Alert
        message="Your Profile is Private"
        description="Nobody can see your profile except for you. If you make your profile public, others will be able to see your name, your existing reviews, and your statistics."
        type="info"
        showIcon
      />
    );
  };

  // If it's your page, we'll explain what it means that your profile is inaccessible
  // If it's not your page, we'll show you a 404 (for now, maybe a different element later)
  const notPublic: JSX.Element = isOwnPage ? <PrivacyExplainer /> : <NotFound />;

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
    <div className="public-profile">{notPublic}</div>
  );

  const toRender = loading ? <Spin /> : profileView;
  return (
    <div className="width80">
      {profileHeader}
      {toRender}
    </div>
  );
}

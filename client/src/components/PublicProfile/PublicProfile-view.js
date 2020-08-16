import React from 'react';

import { Row, Col, Spin } from 'antd';
import NotFound from '../NotFound/NotFound';

import SearchableReviewDisplay from '../SearchableReviewDisplay';
import MinimalStatBox from '../MinimalStatBox';
import Preferences from '../Preferences';

function PublicProfileView({ loading, userDisplayName, reviews, reviewIdToOpen, isOwnPage, onChange }) {
  const pageHeaderProps = {
    pageHeaderTitle: `${userDisplayName}'s Reviews`,
    onPageBack: null,
  };

  const preferences = isOwnPage && (
    <div className="width80">
      <Row>
        <Col span={24}>
          <Preferences onChange={onChange} />
        </Col>
      </Row>
    </div>
  );

  // map reviewId to review
  let reviewToOpen = null;
  if (reviews) {
    reviewToOpen = reviews.find(review => review._id === reviewIdToOpen);
  }

  const profileView = reviews ? (
    <>
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
            deleteReview={null}
            handleModalEdit={null}
            pageHeaderProps={pageHeaderProps}
            hideFooter={true}
          />
        </Col>
      </Row>
    </>
  ) : (
    <NotFound />
  );

  const toRender = loading ? <Spin /> : profileView;
  return (
    <div>
      <Row>
        <Col span={24}>{preferences}</Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="width80">{toRender}</div>
        </Col>
      </Row>
    </div>
  );
}

export default PublicProfileView;

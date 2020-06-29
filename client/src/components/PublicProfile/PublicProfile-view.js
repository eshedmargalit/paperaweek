import React from 'react';

import { Row, Spin } from 'antd';
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
        <Preferences onChange={onChange} />
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
        <MinimalStatBox userDisplayName={userDisplayName} reviews={reviews} />
      </Row>
      <Row>
        <SearchableReviewDisplay
          reviews={reviews}
          reviewToOpen={reviewToOpen}
          deleteReview={null}
          handleModalEdit={null}
          pageHeaderProps={pageHeaderProps}
          hideFooter={true}
        />
      </Row>
    </>
  ) : (
    <NotFound />
  );

  const toRender = loading ? <Spin /> : profileView;
  return (
    <div>
      {preferences}
      <div className="width80">{toRender}</div>
    </div>
  );
}

export default PublicProfileView;

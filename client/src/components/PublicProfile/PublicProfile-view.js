import React from 'react';

import { Row } from 'antd';

import SearchableReviewDisplay from '../SearchableReviewDisplay';
import MinimalStatBox from '../MinimalStatBox';

function PublicProfileView({ userDisplayName, reviews }) {
  const pageHeaderProps = {
    pageHeaderTitle: `${userDisplayName}'s Reviews`,
    onPageBack: null,
  };

  return (
    <div className="width80">
      <Row>
        <MinimalStatBox userDisplayName={userDisplayName} reviews={reviews} />
      </Row>
      <Row>
        <SearchableReviewDisplay
          reviews={reviews.reviewList}
          deleteReview={null}
          handleModalEdit={null}
          pageHeaderProps={pageHeaderProps}
          hideFooter={true}
        />
      </Row>
    </div>
  );
}

export default PublicProfileView;

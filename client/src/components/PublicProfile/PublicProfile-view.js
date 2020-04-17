import React from 'react';

import { Row, Spin } from 'antd';
import NotFound from '../NotFound/NotFound';

import SearchableReviewDisplay from '../SearchableReviewDisplay';
import MinimalStatBox from '../MinimalStatBox';

function PublicProfileView({ loading, userDisplayName, reviews }) {
  const pageHeaderProps = {
    pageHeaderTitle: `${userDisplayName}'s Reviews`,
    onPageBack: null,
  };

  const spinner = <Spin />;
  const profileView = reviews ? (
    <div className="width80">
      <Row>
        <MinimalStatBox userDisplayName={userDisplayName} reviews={reviews} />
      </Row>
      <Row>
        <SearchableReviewDisplay
          reviews={reviews}
          deleteReview={null}
          handleModalEdit={null}
          pageHeaderProps={pageHeaderProps}
          hideFooter={true}
        />
      </Row>
    </div>
  ) : (
    <NotFound />
  );

  return loading ? spinner : profileView;
}

export default PublicProfileView;

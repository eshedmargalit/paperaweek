import React from 'react';

import { Row, Spin } from 'antd';
import NotFound from '../NotFound/NotFound';

import SearchableReviewDisplay from '../SearchableReviewDisplay';
import MinimalStatBox from '../MinimalStatBox';
import Preferences from '../Preferences';

function PublicProfileView({ loading, userDisplayName, reviews, onChange }) {
  const pageHeaderProps = {
    pageHeaderTitle: `${userDisplayName}'s Reviews`,
    onPageBack: null,
  };

  const spinner = <Spin />;
  const preferences = (
    <div className="width80">
      <Row>
        <Preferences onChange={onChange} />
      </Row>
    </div>
  );
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

  const toRender = loading ? spinner : profileView;
  // TODO only visualize preferences if it's your profile...
  return (
    <div>
      {preferences}
      {toRender}
    </div>
  );
}

export default PublicProfileView;

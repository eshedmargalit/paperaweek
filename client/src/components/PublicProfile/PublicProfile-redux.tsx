/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { RouteComponentProps } from 'react-router-dom';
import PublicProfileContainer from './PublicProfile-container';
import { Maybe, Profile, Review, User } from '../../types';

export interface PublicProfileMatchParams {
  userId: User['googleId'];
  reviewIdToOpen: Review['_id'];
}

export type PublicProfileReduxProps = RouteComponentProps<PublicProfileMatchParams>;

// TODO returning string or {} or Profile or null is criminal
const getProfileData = async (userId: User['googleId']): Promise<Maybe<Profile>> => {
  try {
    const { data } = await axios.get<Profile>(`/api/profiles/${userId}`);
    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.response.status);
    return null;
  }
};

export default function PublicProfileRedux({ match }: PublicProfileReduxProps): JSX.Element {
  const [userDisplayName, setUserDisplayName] = useState('');
  const [reviewIdToOpen, setReviewIdToOpen] = useState<Review['_id'] | undefined>(undefined);
  const [reviews, setReviews] = useState<Review[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [isOwnPage, setIsOwnPage] = useState(false);

  const { userId, reviewIdToOpen: matchedReviewId } = match.params;

  const refreshData = async () => {
    setLoading(true);
    const profileData = await getProfileData(userId);
    setLoading(false);

    if (profileData) {
      setReviewIdToOpen(matchedReviewId);
      setIsOwnPage(profileData.isOwnPage);
      setReviews(profileData.reviews);
      setUserDisplayName(profileData.userDisplayName || '');
    }
  };

  const wrappedRefreshData = useCallback(refreshData, []);

  // on mount, get data from the server
  useEffect(() => {
    wrappedRefreshData();
  }, [wrappedRefreshData]);

  return (
    <PublicProfileContainer
      reviews={reviews}
      reviewIdToOpen={reviewIdToOpen}
      userDisplayName={userDisplayName}
      userId={userId}
      loading={loading}
      isOwnPage={isOwnPage}
      onChange={wrappedRefreshData}
    />
  );
}

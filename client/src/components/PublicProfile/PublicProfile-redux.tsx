/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { RouteComponentProps } from 'react-router-dom';
import PublicProfileContainer from './PublicProfile-container';
import { Profile, Review, User } from '../../types';

interface MatchParams {
  userId: User['googleId'];
  reviewIdToOpen: Review['_id'];
}

type PublicProfileReduxProps = RouteComponentProps<MatchParams>;

// Record<string, never> is a fancy way of saying it's always going to be an empty object: {}
type PrivateReview = Record<string, never>;

// TODO returning string or {} or Profile or null is criminal
const getProfileData = async (userId: User['googleId']): Promise<PrivateReview | Profile | null> => {
  try {
    const { data } = await axios.get<Profile | PrivateReview>(`/api/profiles/${userId}`);
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

  const refreshData = async () => {
    // eslint-disable-next-line no-shadow
    const { userId, reviewIdToOpen } = match.params;

    setLoading(true);
    const profileData = await getProfileData(userId);
    setLoading(false);

    // TODO: un-ignore once we update profileRoutes
    if (profileData) {
      setReviewIdToOpen(reviewIdToOpen);
      // @ts-ignore
      setIsOwnPage(profileData.isOwnPage);
      // @ts-ignore
      setReviews(profileData.reviews);
      // @ts-ignore
      setUserDisplayName(profileData.userDisplayName);
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
      loading={loading}
      isOwnPage={isOwnPage}
      onChange={wrappedRefreshData}
    />
  );
}

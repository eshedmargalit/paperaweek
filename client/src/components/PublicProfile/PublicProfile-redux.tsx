/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import PublicProfileContainer from './PublicProfile-container';
import { Maybe, Profile, Review, User } from '../../types';

export interface PublicProfileMatchParams {
  userId: User['googleId'];
  reviewIdToOpen: Review['_id'];
}

export type PublicProfileReduxProps = Record<string, never>;

// TODO returning string or {} or Profile or null is criminal
const getProfileData = async (userId: User['googleId']): Promise<Maybe<Profile>> => {
  try {
    const { data } = await axios.get<Profile>(`/api/profiles/${userId}`);
    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error((err as AxiosError)?.response?.status);
    return null;
  }
};

export default function PublicProfileRedux(): JSX.Element {
  const [userDisplayName, setUserDisplayName] = useState('');
  const [reviewIdToOpen, setReviewIdToOpen] = useState<Review['_id'] | undefined>(undefined);
  const [reviews, setReviews] = useState<Review[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [isOwnPage, setIsOwnPage] = useState(false);

  const { userId, reviewIdToOpen: matchedReviewId } = useParams();

  const refreshData = async () => {
    if (!userId) return;
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
      userId={userId || ''}
      loading={loading}
      isOwnPage={isOwnPage}
      onChange={wrappedRefreshData}
    />
  );
}

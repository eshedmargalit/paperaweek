import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PublicProfileContainer from './PublicProfile-container';

const getProfileData = async userId => {
  let resp = null;
  try {
    resp = await axios.get(`/api/profiles/${userId}`);
  } catch (err) {
    console.log(err.response.status);
  }
  return resp ? resp.data : null;
};

export default function PublicProfileRedux({ match }) {
  const [userDisplayName, setUserDisplayName] = useState('');
  const [reviewIdToOpen, setReviewIdToOpen] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOwnPage, setIsOwnPage] = useState(false);

  const refreshData = async () => {
    const { userId, reviewIdToOpen } = match.params;

    setLoading(true);
    const profileData = await getProfileData(userId);
    setLoading(false);

    if (profileData) {
      setReviewIdToOpen(reviewIdToOpen);
      setIsOwnPage(profileData.isOwnPage);
      setReviews(profileData.reviews);
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

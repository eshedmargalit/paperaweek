import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../../actions';
import MenuBarContainer from './MenuBar-container';

export default function MenuBarRedux() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const drafts = useSelector((state) => state.drafts);

  // by passing [] as the second argument of useEffect, we replicate the behavior
  // of componentDidMount + componentDidUnmount, but not componentDidUpdate
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return <MenuBarContainer user={user} numberOfDrafts={drafts.length} />;
}

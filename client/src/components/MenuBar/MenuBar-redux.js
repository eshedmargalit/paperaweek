import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../../actions';
import MenuBarContainer from './MenuBar-container';

export default function MenuBarRedux() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  });

  const user = useSelector(state => state.user);
  const drafts = useSelector(state => state.drafts);
  return <MenuBarContainer user={user} numberOfDrafts={drafts.length} />;
}

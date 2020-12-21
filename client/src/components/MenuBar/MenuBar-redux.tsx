import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../../actions';
import { RootState } from '../../reducers';
import { Review, User } from '../../types';
import MenuBarContainer from './MenuBar-container';

export default function MenuBarRedux(): JSX.Element {
  const dispatch = useDispatch();
  const user: User = useSelector((state: RootState) => state.user);
  const drafts: Review[] = useSelector((state: RootState) => state.drafts);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return <MenuBarContainer user={user} numberOfDrafts={drafts.length} />;
}

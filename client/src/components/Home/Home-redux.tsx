import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../../actions';
import { RootState } from '../../reducers';
import { User } from '../../types';
import HomeContainer from './Home-container';

export default function HomeRedux(): JSX.Element {
  const dispatch = useDispatch();
  const user: User = useSelector((state: RootState) => state.auth);

  // by passing [dispatch] as the second argument of useEffect, we replicate the behavior
  // of componentDidMount + componentDidUnmount, but not componentDidUpdate
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return <HomeContainer user={user} />;
}

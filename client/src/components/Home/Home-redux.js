import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../../actions';
import HomeContainer from './Home-container';

export default function HomeRedux() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  // by passing [] as the second argument of useEffect, we replicate the behavior
  // of componentDidMount + componentDidUnmount, but not componentDidUpdate
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return <HomeContainer auth={auth} />;
}

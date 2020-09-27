import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../../actions';
import HomeContainer from './Home-container';

export default function HomeRedux() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  });

  const auth = useSelector(state => state.auth);
  return <HomeContainer auth={auth} />;
}

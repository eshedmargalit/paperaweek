// This hook will check if the user is logged in.
// If yes, do nothing.
// If not, this will redirect the user to login.

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchUser } from '../../actions';
import { RootState } from '../../reducers';
import { initialState as initialBlankUser } from '../../reducers/reducer_auth';

interface UseProtectedOptions {
  redirectTo?: string;
}

const DEFAULT_REDIRECT_PATH = '/';

export function useProtected(options?: UseProtectedOptions): void {
  const { push } = useHistory();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  // by passing [dispatch] as the second argument of useEffect, we replicate the behavior
  // of componentDidMount + componentDidUnmount, but not componentDidUpdate
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (!loading && user === initialBlankUser.user) {
    // If this doesn't exist or is equivalent to an empty user, redirect
    push(options?.redirectTo || DEFAULT_REDIRECT_PATH);
  }
}

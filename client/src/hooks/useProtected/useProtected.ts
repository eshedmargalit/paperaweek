// This hook will check if the user is logged in.
// If yes, do nothing.
// If not, this will redirect the user to login.

import { useNavigate } from 'react-router-dom';
import { initialState as initialBlankUser } from '../../slices/authSlice';
import { useAppSelector } from '../reduxHooks';

interface UseProtectedOptions {
  redirectTo?: string;
}

const DEFAULT_REDIRECT_PATH = '/';

export function useProtected(options?: UseProtectedOptions): void {
  const navigate = useNavigate();
  const { user, loading } = useAppSelector(({ auth }) => auth);

  if (!loading && user === initialBlankUser.user) {
    // If this doesn't exist or is equivalent to an empty user, redirect
    navigate(options?.redirectTo || DEFAULT_REDIRECT_PATH);
  }
}

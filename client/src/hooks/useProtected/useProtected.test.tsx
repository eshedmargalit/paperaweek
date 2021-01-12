import React from 'react';
import { useProtected } from '.';
import { RootState } from '../../reducers';
import { blankUser } from '../../templates';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(jest.requireActual('react-router-dom') as any),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

// Because you can't run a hook outside of a react component, we'll make a small test case:
function TestComponent({ redirect }: { redirect?: string }): JSX.Element {
  useProtected({ redirectTo: redirect });
  return <h1>Hi</h1>;
}

describe('useProtected', () => {
  describe('redirect behavior', () => {
    const initialState: RootState = {
      ...getBlankInitialState(),
      auth: { loading: false, user: blankUser },
    };

    it('redirects to the default path if no user is present', () => {
      renderWithRouterRedux(<TestComponent />, { initialState });
      expect(mockHistoryPush).toHaveBeenCalledWith('/');
    });

    it('redirects to a custom path if one is specific', () => {
      renderWithRouterRedux(<TestComponent redirect="customPath" />, { initialState });
      expect(mockHistoryPush).toHaveBeenCalledWith('customPath');
    });

    it('does not redirect if a user is present', () => {
      renderWithRouterRedux(<TestComponent />, {
        initialState: { ...initialState, auth: { user: { ...blankUser, displayName: 'John' }, loading: false } },
      });
      expect(mockHistoryPush).not.toHaveBeenCalled();
    });
  });
});

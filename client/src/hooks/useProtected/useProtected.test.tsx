import React from 'react';
import { useProtected } from '.';
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
    it('redirects to the default path if a user is present', () => {
      renderWithRouterRedux(<TestComponent />);
      expect(mockHistoryPush).toHaveBeenCalledWith('/');
    });

    it('redirects to a custom path if one is specific', () => {
      renderWithRouterRedux(<TestComponent redirect="customPath" />);
      expect(mockHistoryPush).toHaveBeenCalledWith('customPath');
    });

    it('does not redirect if no user is present', () => {
      const initialState = { ...getBlankInitialState(), auth: { ...blankUser, displayName: 'John' } };
      renderWithRouterRedux(<TestComponent />, { initialState });
      expect(mockHistoryPush).not.toHaveBeenCalled();
    });
  });
});

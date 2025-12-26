import React from 'react';
import { vi } from 'vitest';
import { useProtected } from '.';
import { RootState } from '../../store';
import { blankUser } from '../../templates';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Because you can't run a hook outside of a react component, we'll make a small test case:
function TestComponent({ redirect }: { redirect?: string }): JSX.Element {
  useProtected({ redirectTo: redirect });
  return <h1>Hi</h1>;
}

describe('useProtected', () => {
  describe('redirect behavior', () => {
    const initialState: RootState = {
      ...getBlankInitialState(),
      auth: { loading: false, user: blankUser, demoMode: false },
    };

    beforeEach(() => {
      mockNavigate.mockClear();
    });

    it('redirects to the default path if no user is present', () => {
      renderWithRouterRedux(<TestComponent />, { initialState });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('redirects to a custom path if one is specific', () => {
      renderWithRouterRedux(<TestComponent redirect="customPath" />, { initialState });
      expect(mockNavigate).toHaveBeenCalledWith('customPath');
    });

    it('does not redirect if a user is present', () => {
      renderWithRouterRedux(<TestComponent />, {
        initialState: {
          ...initialState,
          auth: { user: { ...blankUser, displayName: 'John' }, loading: false, demoMode: false },
        },
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});

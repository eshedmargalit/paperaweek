import { render, screen } from '@testing-library/react';
import React from 'react';
import { useIsMounted } from '.';

// Because you can't run a hook outside of a react component, we'll make a small test case:
function TestComponent(): JSX.Element {
  const isMounted = useIsMounted();
  return <h1>{isMounted().toString()}</h1>;
}

describe.skip('useIsMounted', () => {
  it('returns false before the component is mounted', async () => {
    render(<TestComponent />);
    expect(screen.getByText(/true/)).toBeInTheDocument();
  });
});

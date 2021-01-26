/* eslint-disable no-console */
/* eslint-disable no-return-assign */

/**
 *  This is silly, but the react-katex library throws an ugly warning: https://github.com/talyssonoc/react-katex/issues/59
 *  so we'll just suppress it :)
 */
export function suppressWarnings(): void {
  const originalConsoleWarn = console.warn;
  beforeAll(() => (console.warn = jest.fn()));
  afterAll(() => (console.warn = originalConsoleWarn));
}

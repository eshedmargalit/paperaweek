/* eslint-disable import/no-extraneous-dependencies */
// This is a known limitation of antd, we need to mock matchMedia since JSDOM doesn't implement it
// https://github.com/ant-design/ant-design/issues/21096
import { vi } from 'vitest';
import { server } from './mocks/server';

import '@testing-library/jest-dom/extend-expect';

// Suppress React act() warnings from third-party components (antd, etc.)
// These warnings are caused by internal state updates in libraries we don't control
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: An update to') ||
        args[0].includes('was not wrapped in act') ||
        args[0].includes('When testing, code that causes React state updates'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

global.matchMedia =
  global.matchMedia ||
  (() => ({
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }));

// Mock ResizeObserver which is not available in jsdom
global.ResizeObserver = class ResizeObserver {
  // eslint-disable-next-line class-methods-use-this
  observe() {}

  // eslint-disable-next-line class-methods-use-this
  unobserve() {}

  // eslint-disable-next-line class-methods-use-this
  disconnect() {}
};

export {};
// Establish API mocking before all tests.
beforeAll(() => server.listen());
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());

/* eslint-disable import/no-extraneous-dependencies */
// This is a known limitation of antd, we need to mock matchMedia since JSDOM doesn't implement it
// https://github.com/ant-design/ant-design/issues/21096
import { vi } from 'vitest';
import { server } from './mocks/server';

import '@testing-library/jest-dom/extend-expect';

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

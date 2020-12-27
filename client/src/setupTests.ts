// This is a known limitation of antd, we need to mock matchMedia since JSDOM doesn't implement it
// https://github.com/ant-design/ant-design/issues/21096
import { server } from './mocks/server';

global.matchMedia =
  global.matchMedia ||
  (() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));

export {};
// Establish API mocking before all tests.
beforeAll(() => server.listen());
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());

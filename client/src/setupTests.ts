// This is a known limitation of antd, we need to mock matchMedia since JSDOM doesn't implement it
// https://github.com/ant-design/ant-design/issues/21096
global.matchMedia =
  global.matchMedia ||
  (() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));

export {};

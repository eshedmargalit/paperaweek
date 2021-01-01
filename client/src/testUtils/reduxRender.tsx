import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { applyMiddleware, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import rootReducer, { RootState } from '../reducers';

interface RenderWithReduxOptions {
  initialState?: RootState;
  store?: Store;
}

interface RenderWithReduxResult extends RenderResult {
  store: Store;
}
/**
 * Render the component wrapped in a mock router and a Redux provider
 */
export function renderWithRedux(
  ui: React.ReactElement,
  { initialState, store = createStore(rootReducer, initialState, applyMiddleware(thunk)) }: RenderWithReduxOptions = {}
): RenderWithReduxResult {
  return {
    ...render(
      <MemoryRouter>
        <Provider store={store}>{ui}</Provider>
      </MemoryRouter>
    ),
    store,
  };
}

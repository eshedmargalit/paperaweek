import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { applyMiddleware, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import { create } from 'lodash';
import rootReducer, { RootState } from '../reducers';

interface RenderWithRouterReduxOptions {
  redirectTo?: string;
  initialState?: RootState;
  store?: Store;
}

interface RenderWithRouterReduxResult extends RenderResult {
  store: Store;
}
/**
 * Render the component wrapped in a mock router and a Redux provider
 */
export function renderWithRouterRedux(
  ui: React.ReactElement,
  {
    redirectTo,
    initialState,
    store = createStore(rootReducer, initialState, applyMiddleware(thunk)),
  }: RenderWithRouterReduxOptions = {}
): RenderWithRouterReduxResult {
  return {
    ...render(
      <MemoryRouter initialEntries={['/starting']}>
        <Route path="/starting">
          <Provider store={store}>{ui}</Provider>
        </Route>
        <Route path={redirectTo}>Redirected to a new page.</Route>
      </MemoryRouter>
    ),
    store,
  };
}

// Exported to help tests quickly get a blank initialState to work with
export function getBlankInitialState(): RootState {
  const store = createStore(rootReducer, applyMiddleware(thunk));
  return store.getState();
}

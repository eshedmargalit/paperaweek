import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Store } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { configureStoreOptions, RootState } from '../store';

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
    store = configureStore({
      ...configureStoreOptions,
      preloadedState: initialState,
    }),
  }: RenderWithRouterReduxOptions = {}
): RenderWithRouterReduxResult {
  return {
    ...render(
      <MemoryRouter initialEntries={['/starting']}>
        <Routes>
          <Route path="/starting" element={<Provider store={store}>{ui}</Provider>} />
          <Route path={redirectTo || '/redirected'} element={<>Redirected to a new page.</>} />
        </Routes>
      </MemoryRouter>
    ),
    store,
  };
}

// Exported to help tests quickly get a blank initialState to work with
export function getBlankInitialState(): RootState {
  return configureStore(configureStoreOptions).getState();
}

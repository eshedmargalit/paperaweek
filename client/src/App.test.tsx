import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import { configureStoreOptions } from './store';

describe('<App />', () => {
  it('renders without crashing', () => {
    const store = configureStore(configureStoreOptions);
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });
});

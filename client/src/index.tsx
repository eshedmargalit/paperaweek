import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import * as serviceWorker from './serviceWorker';
import MaintenancePage from './components/MaintenancePage';

// This is set at the highest possible point so we can serve this even if the rest of the server is down
// and this prevents users from getting around the page by directly hitting endpoints registered by React Router
const IS_UNDER_MAINTENANCE = false;

ReactDOM.render(
  <Provider store={store}>{!IS_UNDER_MAINTENANCE ? <App /> : <MaintenancePage />}</Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

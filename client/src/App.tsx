import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login/Login';
import ReviewWizard from './components/ReviewWizard';
import DraftPage from './components/DraftPage';
import MenuBar from './components/MenuBar';
import PublicProfile from './components/PublicProfile';
import NotFound from './components/NotFound/NotFound';

import './App.scss';
import { useAppDispatch } from './hooks/reduxHooks';
import { fetchUser } from './actions';

export default function App(): JSX.Element {
  const dispatch = useAppDispatch();

  // by passing [dispatch] as the second argument of useEffect, we replicate the behavior
  // of componentDidMount + componentDidUnmount, but not componentDidUpdate
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="App">
        <Route path="/" component={MenuBar} />
        <Switch>
          <Route path="/profiles/:userId/:reviewIdToOpen?" component={PublicProfile} />
          <Route exact path="/" component={Login} />
          <Route exact path="/dashboard" component={Home} />
          <Route exact path="/form" component={ReviewWizard} />
          <Route exact path="/drafts" component={DraftPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

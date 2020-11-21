import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login/Login';
import ReviewWizard from './components/ReviewWizard';
import PAWForm from './components/ReviewWizard/PAWForm';
import DraftPage from './components/DraftPage';
import MenuBar from './components/MenuBar';
import PublicProfile from './components/PublicProfile';
import Preferences from './components/Preferences';
import NotFound from './components/NotFound/NotFound';
import { fetchUser } from './actions';

import './App.css';

export default function App() {
  const dispatch = useDispatch();

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
          <Route exact path="/" render={props => <Login {...props} justSignedOut={false} />} />
          <Route exact path="/signout" render={props => <Login {...props} justSignedOut={true} />} />
          <Route exact path="/dashboard" component={Home} />
          <Route exact path="/form" component={PAWForm} />
          <Route exact path="/drafts" component={DraftPage} />
          <Route exact path="/preferences" component={Preferences} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login/Login';
import PointsModal from './components/PointsModal/PointsModal';
import ReviewWizard from './components/ReviewWizard';
import DraftPage from './components/DraftPage';
import MenuBar from './components/MenuBar';
import PublicProfile from './components/PublicProfile';
import NotFound from './components/NotFound/NotFound';
import * as actions from './actions';

import './App.css';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route path="/" component={PointsModal} />
          <Route path="/" component={MenuBar} />
          <Switch>
            <Route path="/profiles/:userId" component={PublicProfile} />
            <Route exact path="/" render={props => <Login {...props} justSignedOut={false} />} />
            <Route exact path="/signout" render={props => <Login {...props} justSignedOut={true} />} />
            <Route exact path="/dashboard" component={Home} />
            <Route exact path="/form" component={ReviewWizard} />
            <Route exact path="/drafts" component={DraftPage} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default connect(
  null,
  actions
)(App);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login/Login';
import PointsModal from './components/PointsModal/PointsModal';
import ReviewWizard from './components/ReviewWizard';
import DraftPage from './components/DraftPage';
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
          <Route path="/" render={props => <PointsModal {...props} />} />
          <Route exact path="/" render={props => <Login {...props} justSignedOut={false} />} />
          <Route exact path="/signout" render={props => <Login {...props} justSignedOut={true} />} />
          <Route exact path="/dashboard" render={props => <Home {...props} />} />
          <Route exact path="/form" render={props => <ReviewWizard {...props} />} />
          <Route exact path="/drafts" render={props => <DraftPage {...props} />} />
        </div>
      </BrowserRouter>
    );
  }
}

export default connect(
  null,
  actions
)(App);

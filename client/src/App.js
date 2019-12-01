import React from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login/Login';
import ReviewWizard from './components/ReviewWizard/ReviewWizard';
import { CognitoAuth } from 'amazon-cognito-auth-js';
import { getAuthData } from './utils.js';

function App() {
  let auth = new CognitoAuth(getAuthData());
  auth.userhandler = {
    onSuccess: function(result) {
      console.log('Sign in successful');
      console.log(result);
    },
    onFailure: function(err) {
      console.log('Sign in unsuccessful');
      console.log(err);
    },
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/" render={props => <Login {...props} auth={auth} justSignedOut={false} />} />
        <Route exact path="/signout" render={props => <Login {...props} auth={auth} justSignedOut={true} />} />
        <Route exact path="/dashboard" render={props => <Home {...props} auth={auth} />} />
        <Route exact path="/form" render={props => <ReviewWizard {...props} />} />
      </div>
    </BrowserRouter>
  );
}

export default App;

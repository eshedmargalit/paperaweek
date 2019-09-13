import React from "react";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import SignOut from "./components/SignOut/SignOut";
import { CognitoAuth } from "amazon-cognito-auth-js";
import { getAuthData } from "./utils.js";

function App() {
  let auth = new CognitoAuth(getAuthData());
  auth.userhandler = {
    onSuccess: function(result) {
      console.log("Sign in successful");
      console.log(result);
    },
    onFailure: function(err) {
      console.log("Sign in unsuccessful");
      console.log(err);
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Route
          exact
          path="/"
          render={props => <Home {...props} auth={auth} />}
        />
        <Route
          exact
          path="/dashboard"
          render={props => <Dashboard {...props} auth={auth} />}
        />
        <Route exact path="/signout" component={SignOut} />
      </div>
    </BrowserRouter>
  );
}

export default App;

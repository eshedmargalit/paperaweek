import React from "react";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import ReviewForm from "./components/ReviewForm/ReviewForm";
import Dashboard from "./components/Dashboard/Dashboard";
import SignOut from "./components/SignOut/SignOut";
import { CognitoAuth } from "amazon-cognito-auth-js";

function App() {
  var authData = {
    ClientId: "2vpouevkvestdot5o94m8tbnf4",
    AppWebDomain: "paperaweek.auth.us-west-2.amazoncognito.com",
    TokenScopesArray: [
      "phone",
      "email",
      "profile",
      "openid",
      "aws.cognito.signin.user.admin"
    ],
    RedirectUriSignIn: "http://localhost:3000/Dashboard",
    RedirectUriSignOut: "http://localhost:3000/SignOut",
    IdentityProvider: "Google",
    UserPoolId: "us-west-2_qQAUz1CtO",
    AdvancedSecurityDataCollectionFlag: true
  };
  let auth = new CognitoAuth(authData);
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
        <Route exact path="/Form" component={ReviewForm} />
        <Route
          exact
          path="/Dashboard"
          render={props => <Dashboard {...props} auth={auth} />}
        />
        <Route exact path="/SignOut" component={SignOut} />
      </div>
    </BrowserRouter>
  );
}

export default App;

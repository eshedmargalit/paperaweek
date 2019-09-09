import React, { Component } from "react";

class Dashboard extends Component {
  componentDidMount() {
    let { auth } = this.props;

    // parse return URL from cognito
    auth.parseCognitoWebResponse(window.location.href);

    // read data from auth object
    let user = auth.getCurrentUser();
    console.log(auth.signInUserSession.accessToken);

    fetch("/api/auth", {
      headers: { "content-type": "application/json", user: user }
    })
      .then(response => response.json())
      .then(data => console.log(data));
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          width: "50%",
          margin: "auto",
          marginTop: "100px"
        }}
      >
        Hi, I'm Paul
      </div>
    );
  }
}

export default Dashboard;

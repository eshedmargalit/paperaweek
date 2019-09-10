import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayName: null
    };
  }
  componentDidMount() {
    let { auth } = this.props;

    // parse return URL from cognito
    auth.parseCognitoWebResponse(window.location.href);

    // send JWT to backend
    fetch("/api/auth", {
      headers: {
        "content-type": "application/json",
        idToken: auth.signInUserSession.idToken.jwtToken
      }
    })
      .then(response => response.json())
      .then(({ name }) => this.setState({ displayName: name }));
  }

  render() {
    let { displayName } = this.state;
    let name_render = displayName || "Unidentified";
    return (
      <div
        style={{
          display: "flex",
          width: "50%",
          margin: "auto",
          marginTop: "100px",
          justifyContent: "space-between"
        }}
      >
        <div>Hello there, {name_render}!</div>
        <div>
          <Link to="/">
            {" "}
            <Button> Back Home </Button>{" "}
          </Link>
        </div>
      </div>
    );
  }
}

export default Dashboard;

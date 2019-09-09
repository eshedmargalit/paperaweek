import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display_name: null
    };
  }
  componentDidMount() {
    let { auth } = this.props;

    // parse return URL from cognito
    auth.parseCognitoWebResponse(window.location.href);
    console.log(auth.signInUserSession);

    // send JWT to backend
    fetch("/api/auth", {
      headers: {
        "content-type": "application/json",
        idToken: auth.signInUserSession.idToken.jwtToken
      }
    })
      .then(response => response.json())
      .then(data => this.setState({ display_name: data.name }));
  }

  render() {
    let { display_name } = this.state;
    let name_render = display_name ? display_name : "Unidentified";
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

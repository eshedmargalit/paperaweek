import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Modal } from "antd";

class SignOut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      return_home: false
    };
  }
  componentDidMount() {
    let secondsToGo = 3;
    const modal = Modal.success({
      title: "Sign out successful!",
      content: `Taking you home in ${secondsToGo}...`
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: `Taking you home in ${secondsToGo}...`
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
      this.setState({
        return_home: true
      });
    }, secondsToGo * 1000);
  }

  render() {
    let to_render = null;
    if (this.state.return_home) {
      to_render = <Redirect to="/" push />;
    }

    return to_render;
  }
}

export default SignOut;

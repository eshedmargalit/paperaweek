import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Modal } from "antd";

class SignOut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      returnHome: false
    };
  }
  componentDidMount() {
    let secondsToGo = 2;
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
        returnHome: true
      });
    }, secondsToGo * 1000);
  }

  render() {
    return this.state.returnHome ? <Redirect to="/" push /> : null;
  }
}

export default SignOut;

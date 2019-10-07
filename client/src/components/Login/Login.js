import React, { Component } from "react";
import { Button } from "antd";
import { connect } from "react-redux";

class Login extends Component {
  signIn = () => {
    this.props.auth.getSession();
  };

  render() {
    return (
      <div>
        <div>
          <Button onClick={this.signIn}>Sign In</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state
  };
};

export default connect(
  mapStateToProps,
  null
)(Login);

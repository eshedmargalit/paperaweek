import React, { Component } from "react";
import { Button } from "antd";
import LazyHero from "react-lazy-hero";
import { connect } from "react-redux";

class Login extends Component {
  signIn = () => {
    this.props.auth.getSession();
  };

  render() {
    return (
      <div>
        <LazyHero
          minHeight="80vh"
          opacity={0.7}
          parallaxOffset={100}
          color="gray"
          imageSrc="https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1661&q=80"
          style={{ overflow: "hidden", color: "white" }}
        >
          <h1>Paper a Week</h1>
          <h5 style={{ textAlign: "center" }}>
            Read a paper a week. That's it.
          </h5>
          <Button
            onClick={this.signIn}
            style={{
              outline: "none"
            }}
          >
            {" "}
            Unleash your Inner Blockchain{" "}
          </Button>
        </LazyHero>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "40%", marginLeft: "25px" }}>
            <h6
              style={{
                margin: "auto"
              }}
            >
              Because remembering to read papers is harder than it should be.
            </h6>
          </div>
          <div style={{ width: "40%", marginLeft: "25px" }}>
            <h6
              style={{
                margin: "auto"
              }}
            >
              Some text that the PR team can fill in later, but I assume it will
              be approximately this length, if not a little bit longer.
            </h6>
          </div>
        </div>
        <div style={{ float: "left", clear: "both" }} />
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

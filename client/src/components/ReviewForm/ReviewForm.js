import React, { Component } from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { exit_form } from "../../actions/index";

class ReviewForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      illputsomethinghereeventuallyleavemealone: ""
    };
  }

  renderMetadata() {
    let meta = this.props.data.review.metadata;

    let author_render = null;
    let date_render = null;
    if (meta.date) {
      date_render = meta.date.toString();
    }
    return (
      <div>
        <h5>{meta.title}</h5>
        {author_render}
        <ul>
          <li>Date: {date_render}</li>
          <li>DOI: {meta.doi}</li>
          <li>Journal: {meta.journal}</li>
          <li>URL: {meta.url}</li>
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderMetadata()}
        <Button
          onClick={() => {
            this.props.dispatch(exit_form());
          }}
        >
          {" "}
          Back to Home{" "}
        </Button>
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
)(ReviewForm);

import React, { Component } from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import { FadeLoader } from "react-spinners";
import ReviewReader from "../ReviewReader/ReviewReader";
import PaperSearchBar from "../PaperSearchBar/PaperSearchBar";
import ReviewForm from "../ReviewForm/ReviewForm";
import "./Home.css";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      papers: []
    };
  }

  componentDidMount() {
    fetch("/api/papers")
      .then(response => response.json())
      .then(data => this.setState({ papers: data, loading: false }));
  }

  refreshPapers = () => {
    fetch("/api/papers")
      .then(response => response.json())
      .then(data => this.setState({ papers: data, loading: false }));
  };

  render() {
    // need to use Form.create to inject this.props.form in the ReviewForm component
    const WrappedReviewForm = Form.create({ name: "review_form" })(ReviewForm);

    const home_render = (
      <div>
        <div className="width80">
          <PaperSearchBar />
        </div>
        <div className="width80">
          {this.state.loading ? (
            <div>
              <h6> Loading Reviews </h6>
              <FadeLoader />
            </div>
          ) : (
            <ReviewReader papers={this.state.papers} />
          )}
        </div>
      </div>
    );

    const form_render = (
      <div>
        <div className="width80">
          <WrappedReviewForm refreshPapers={this.refreshPapers} />
        </div>
      </div>
    );

    return this.props.data.review.displayForm ? form_render : home_render;
  }
}

const mapStateToProps = state => {
  return {
    data: state
  };
};

export default connect(mapStateToProps)(Home);

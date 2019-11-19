import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Carousel, Icon, Menu } from "antd";
import { FadeLoader } from "react-spinners";
import ReviewReader from "../ReviewReader/ReviewReader";
import ReadingList from "../ReadingList/ReadingList";
import PaperSearchBar from "../PaperSearchBar/PaperSearchBar";
import ReviewWizard from "../ReviewWizard/ReviewWizard";
import { start_review } from "../../actions/index";
import arrayMove from "array-move";
import moment from "moment";
import "./Home.css";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayName: "Unidentified. Show yourself!",
      loading: true,
      papers: [],
      readingList: []
    };
  }

  componentDidMount() {
    fetch("/api/papers")
      .then(response => response.json())
      .then(data => this.setState({ papers: data, loading: false }));

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

  onReadingListSort = ({ oldIndex, newIndex }) => {
    this.setState({
      readingList: arrayMove(this.state.readingList, oldIndex, newIndex)
    });
  };

  signOut = () => {
    this.props.auth.signOut();
  };

  refreshPapers = () => {
    fetch("/api/papers")
      .then(response => response.json())
      .then(data => this.setState({ papers: data, loading: false }));
  };

  startBlankReview = () => {
    this.props.dispatch(start_review(null));
  };

  addToReadingList = review => {
    // TODO: prevent dupes
    let currReadingList = this.state.readingList;
    let newReadingList = currReadingList.concat(review);
    this.setState({ readingList: newReadingList });
  };

  removeFromReadingList = review => {
    let newReadingList = this.state.readingList.filter(currReview => {
      return currReview !== review;
    });
    this.setState({ readingList: newReadingList });
  };

  renderCarousel() {
    let numberOfDaysSinceLastReview = "forever! Get reviewing!";
    console.log(
      moment.max(this.state.papers.map(paper => moment(paper.createdAt)))
    );
    if (this.state.papers.length > 0) {
      numberOfDaysSinceLastReview = moment().diff(
        moment.max(this.state.papers.map(paper => moment(paper.createdAt))),
        "days"
      );
    }
    const carouselContent = [
      "A paper a week keeps the literature review on fleek",
      "Believe first and foremost in yourself!",
      "I'm trapped in here, please help me! It's been weeks...",
      "Reading papers is fun AND nutritious! 🤪",
      `Number of days since last review: ${numberOfDaysSinceLastReview}`
    ];
    return (
      <Carousel autoplay speed={1000}>
        {carouselContent.map(item => {
          return <h3 key={`carousel ${item}`}>{item}</h3>;
        })}
      </Carousel>
    );
  }

  render() {
    const home_render = (
      <div>
        <Menu mode="horizontal">
          <Menu.Item>
            <h5>
              <Icon type="user" />
              Hi there, {this.state.displayName}!
            </h5>
          </Menu.Item>
          <Menu.Item style={{ float: "right" }}>
            <Button onClick={this.signOut}>Sign Out</Button>
          </Menu.Item>
        </Menu>
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className="width80"
        >
          <div style={{ width: "60%" }}>
            <PaperSearchBar
              addToReadingListHandler={this.addToReadingList}
              carousel={this.renderCarousel()}
            />
            <Button
              style={{ marginTop: "2px" }}
              onClick={this.startBlankReview}
            >
              Create Manual Entry <Icon type="plus-circle" />
            </Button>
          </div>
          <div style={{ width: "35%" }}>
            <ReadingList
              onSortEnd={this.onReadingListSort}
              removeItemHandler={this.removeFromReadingList}
              items={this.state.readingList}
            />
          </div>
        </div>
        <div className="width80">
          {this.state.loading ? (
            <div>
              <h6> Loading Reviews </h6>
              <FadeLoader />
            </div>
          ) : (
            <ReviewReader
              refreshPapers={this.refreshPapers}
              papers={this.state.papers}
            />
          )}
        </div>
      </div>
    );

    const form_render = (
      <div>
        <div className="width80">
          <ReviewWizard refreshPapers={this.refreshPapers} />
        </div>
      </div>
    );

    return (
      <div>
        {this.props.data.review_data.displayForm ? form_render : home_render}
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
)(Home);

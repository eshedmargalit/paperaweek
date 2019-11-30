import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Carousel, Icon, Menu } from 'antd';
import { FadeLoader } from 'react-spinners';
import ReviewReader from '../ReviewReader/ReviewReader';
import ReadingList from '../ReadingList/ReadingList';
import PaperSearchBar from '../PaperSearchBar/PaperSearchBar';
import {
  updateReadingList,
  updateReviews,
  login_failed,
  login_success,
  login_pending,
  startReview,
} from '../../actions/index';
import arrayMove from 'array-move';
import moment from 'moment';
import './Home.scss';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.props.dispatch(login_pending());

    let { auth } = this.props;

    // parse return URL from cognito
    auth.parseCognitoWebResponse(window.location.href);

    // send JWT to backend
    let auth_data;
    try {
      auth_data = await fetch('/api/auth', {
        headers: {
          'content-type': 'application/json',
          idToken: auth.signInUserSession.idToken.jwtToken,
        },
      }).then(response => response.json());
      this.props.dispatch(login_success(auth_data.display_name, auth_data._id));
      this.props.dispatch(updateReviews(auth_data.reviews));
      this.props.dispatch(updateReadingList(auth_data.reading_list));
    } catch (error) {
      this.props.dispatch(login_failed(error));
    }
  }

  signOut = () => {
    this.props.auth.signOut();
  };

  _updateReadingList = newReadingList => {
    this.props.dispatch(updateReadingList(newReadingList));

    let headers = {
      'content-type': 'application/json',
      userid: this.props.user.userid,
    };

    fetch('/api/readingList', {
      method: 'put',
      headers: headers,
      body: JSON.stringify(newReadingList),
    })
      .then(response => response.json())
      .then(data => {
        this.props.dispatch(updateReadingList(data));
      });
  };

  addToReadingList = review => {
    const paper = review.paper;

    let currReadingList = this.props.readingList;
    let newReadingList = currReadingList.concat(paper);
    this._updateReadingList(newReadingList);
  };

  onReadingListSort = ({ oldIndex, newIndex }) => {
    let newReadingList = arrayMove(this.props.readingList, oldIndex, newIndex);
    this._updateReadingList(newReadingList);
  };

  removeFromReadingList = paper => {
    let newReadingList = this.props.readingList.filter(currPaper => {
      return currPaper !== paper;
    });
    this._updateReadingList(newReadingList);
  };

  startBlankReview = () => {
    this.props.dispatch(startReview(null));
  };

  renderCarousel() {
    let { reviewList } = this.props.reviews;
    let numberOfDaysSinceLastReview = 'forever! Get reviewing!';
    if (reviewList.length > 0) {
      numberOfDaysSinceLastReview = moment().diff(moment.max(reviewList.map(paper => moment(paper.createdAt))), 'days');
    }
    const carouselContent = [
      'A paper a week keeps the literature review on fleek',
      'Believe first and foremost in yourself!',
      "I'm trapped in here, please help me! It's been weeks...",
      'Reading papers is fun AND nutritious! 🤪',
      `Number of days since last review: ${numberOfDaysSinceLastReview}`,
    ];
    return (
      <Carousel className="carousel" autoplay speed={1000}>
        {carouselContent.map(item => {
          return (
            <h3 className="carousel__content" key={`carousel ${item}`}>
              {item}
            </h3>
          );
        })}
      </Carousel>
    );
  }

  render() {
    let formRedirect = <Redirect to="/form" push />;
    let { user, reviews, readingList, activeReview } = this.props;
    let { reviewList, loading } = reviews;
    const home_render = (
      <div>
        <Menu className="menu" mode="horizontal">
          <Menu.Item>
            <h5>
              <Icon type="user" />
              Hi there, {user.displayName}!
            </h5>
          </Menu.Item>
          <Menu.Item className="menu__item">
            <Button onClick={this.signOut}>Sign Out</Button>
          </Menu.Item>
        </Menu>
        <div className="searchbar width80">
          <div style={{ width: '60%' }}>
            <PaperSearchBar
              startBlankReview={this.startBlankReview}
              addToReadingListHandler={this.addToReadingList}
              carousel={this.renderCarousel()}
            />
          </div>
          <div style={{ width: '35%' }}>
            <ReadingList
              onSortEnd={this.onReadingListSort}
              removeItemHandler={this.removeFromReadingList}
              items={readingList}
            />
          </div>
        </div>
        <div className="width80">
          {loading ? (
            <div>
              <h6> Loading Reviews </h6>
              <FadeLoader />
            </div>
          ) : (
            <ReviewReader />
          )}
        </div>
      </div>
    );

    return <div>{activeReview.showForm ? formRedirect : home_render}</div>;
  }
}

const mapStateToProps = ({ reviews, readingList, user, activeReview }) => {
  return {
    reviews,
    readingList,
    user,
    activeReview,
  };
};

export default connect(
  mapStateToProps,
  null
)(Home);

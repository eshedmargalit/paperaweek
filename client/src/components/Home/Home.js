import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Icon, Menu } from 'antd';
import { FadeLoader } from 'react-spinners';
import ReviewReader from '../ReviewReader/ReviewReader';
import ReadingList from '../ReadingList';
import PaperSearchBar from '../PaperSearchBar';

import {
  updateReadingList,
  updateReviews,
  loginFailed,
  loginSuccess,
  loginPending,
  startReview,
} from '../../actions/index';
import './Home.scss';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.props.dispatch(loginPending());

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
      this.props.dispatch(loginSuccess(auth_data.display_name, auth_data._id));
      this.props.dispatch(updateReviews(auth_data.reviews));
      this.props.dispatch(updateReadingList(auth_data.reading_list));
    } catch (error) {
      this.props.dispatch(loginFailed(error));
    }
  }

  startBlankReview = () => {
    this.props.dispatch(startReview(null));
  };

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
            <Button onClick={this.props.auth.signOut}>Sign Out</Button>
          </Menu.Item>
        </Menu>
        <div className="searchbar width80">
          <div style={{ width: '60%' }}>
            <PaperSearchBar />
          </div>
          <div style={{ width: '35%' }}>
            <ReadingList />
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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Carousel, Icon, Menu } from 'antd';
import { FadeLoader } from 'react-spinners';
import ReviewReader from '../ReviewReader/ReviewReader';
import ReadingList from '../ReadingList/ReadingList';
import PaperSearchBar from '../PaperSearchBar/PaperSearchBar';
import ReviewWizard from '../ReviewWizard/ReviewWizard';
import { start_review } from '../../actions/index';
import arrayMove from 'array-move';
import moment from 'moment';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayName: 'Unidentified. Show yourself!',
      userid: null,
      loading: true,
      reviews: [],
      readingList: [],
    };
  }

  async componentDidMount() {
    let { auth } = this.props;

    // parse return URL from cognito
    auth.parseCognitoWebResponse(window.location.href);

    // send JWT to backend
    let auth_data = await fetch('/api/auth', {
      headers: {
        'content-type': 'application/json',
        idToken: auth.signInUserSession.idToken.jwtToken,
      },
    }).then(response => response.json());

    console.log(auth_data);
    // finally, set state
    this.setState({
      displayName: auth_data.display_name,
      userid: auth_data._id,
      loading: false,
      reviews: auth_data.reviews,
      readingList: auth_data.reading_list,
    });
  }

  onReadingListSort = ({ oldIndex, newIndex }) => {
    let newReadingList = arrayMove(this.state.readingList, oldIndex, newIndex);
    this.setState(
      {
        readingList: newReadingList,
      },
      () => {
        let headers = {
          'content-type': 'application/json',
          userid: this.state.userid,
        };

        // Update the backend with this new readinglist
        fetch('/api/readingList', {
          method: 'put',
          headers: headers,
          body: JSON.stringify(this.state.readingList),
        });
      }
    );
  };

  signOut = () => {
    this.props.auth.signOut();
  };

  refreshPapers = () => {
    fetch('/api/papers', {
      headers: { userid: this.state.userid },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({ reviews: data, loading: false });
      });
  };

  startBlankReview = () => {
    this.props.dispatch(start_review(null));
  };

  addToReadingList = review => {
    const paper = review.paper;
    let currReadingList = this.state.readingList;

    let newReadingList = currReadingList.concat(paper);
    this.setState({ readingList: newReadingList }, () => {
      let headers = {
        'content-type': 'application/json',
        userid: this.state.userid,
      };
      fetch('/api/readingList', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(paper),
      })
        .then(response => response.json())
        .then(data => {
          this.setState({ readingList: data });
        });
    });
  };

  removeFromReadingList = paper => {
    let newReadingList = this.state.readingList.filter(currPaper => {
      return currPaper !== paper;
    });

    this.setState({ readingList: newReadingList }, () => {
      let headers = {
        'content-type': 'application/json',
        userid: this.state.userid,
      };
      fetch('/api/readingList', {
        method: 'delete',
        headers: headers,
        body: JSON.stringify(paper),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
        });
    });
  };

  renderCarousel() {
    let numberOfDaysSinceLastReview = 'forever! Get reviewing!';
    if (this.state.reviews.length > 0) {
      numberOfDaysSinceLastReview = moment().diff(
        moment.max(this.state.reviews.map(paper => moment(paper.createdAt))),
        'days'
      );
    }
    const carouselContent = [
      'A paper a week keeps the literature review on fleek',
      'Believe first and foremost in yourself!',
      "I'm trapped in here, please help me! It's been weeks...",
      'Reading papers is fun AND nutritious! 🤪',
      `Number of days since last review: ${numberOfDaysSinceLastReview}`,
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
          <Menu.Item style={{ float: 'right' }}>
            <Button onClick={this.signOut}>Sign Out</Button>
          </Menu.Item>
        </Menu>
        <div
          style={{ display: 'flex', justifyContent: 'space-between' }}
          className="width80"
        >
          <div style={{ width: '60%' }}>
            <PaperSearchBar
              addToReadingListHandler={this.addToReadingList}
              carousel={this.renderCarousel()}
            />
            <Button
              style={{ marginTop: '2px' }}
              onClick={this.startBlankReview}
            >
              Create Manual Entry <Icon type="plus-circle" />
            </Button>
          </div>
          <div style={{ width: '35%' }}>
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
              userid={this.state.userid}
              refreshPapers={this.refreshPapers}
              reviews={this.state.reviews}
            />
          )}
        </div>
      </div>
    );

    const form_render = (
      <div>
        <div className="width80">
          <ReviewWizard
            userid={this.state.userid}
            refreshPapers={this.refreshPapers}
          />
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
    data: state,
  };
};

export default connect(mapStateToProps, null)(Home);

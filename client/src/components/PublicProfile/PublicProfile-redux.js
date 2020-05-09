import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PublicProfileContainer from './PublicProfile-container';

class PublicProfileRedux extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userDisplayName: '',
      reviews: null,
      loading: false,
      isOwnPage: false,
    };

    this.refreshData = this.refreshData.bind(this);
  }

  componentWillReceiveProps() {
    this.refreshData();
  }

  getProfileData = async userId => {
    let resp = null;
    try {
      resp = await axios.get(`/api/profiles/${userId}`);
    } catch (err) {
      console.log(err.response.status);
    }
    return resp ? resp.data : null;
  };

  async refreshData() {
    const { userId } = this.props.match.params;
    const { googleId } = this.props.user;

    this.setState({ loading: true });
    const profileData = await this.getProfileData(userId);
    this.setState({ loading: false });

    const isOwnPage = userId === googleId;
    console.log(userId, googleId, isOwnPage);

    let userDisplayName,
      reviews = null;

    if (profileData) {
      userDisplayName = profileData.userDisplayName;
      reviews = profileData.reviews;
    }

    this.setState({
      userDisplayName,
      reviews,
      isOwnPage,
    });
  }

  render() {
    return (
      <PublicProfileContainer
        reviews={this.state.reviews}
        userDisplayName={this.state.userDisplayName}
        loading={this.state.loading}
        isOwnPage={this.state.isOwnPage}
        onChange={this.refreshData}
      />
    );
  }
}

const mapStateToProps = ({ user }) => {
  return {
    user,
  };
};

export default connect(mapStateToProps, null)(PublicProfileRedux);

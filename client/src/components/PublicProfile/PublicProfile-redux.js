import React, { Component } from 'react';
import axios from 'axios';
import PublicProfileContainer from './PublicProfile-container';

class PublicProfileRedux extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userDisplayName: '',
      reviewIdToOpen: null,
      reviews: null,
      loading: false,
      isOwnPage: false,
    };

    this.refreshData = this.refreshData.bind(this);
  }

  componentDidMount() {
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
    const { userId, reviewIdToOpen } = this.props.match.params;

    this.setState({ loading: true });
    const profileData = await this.getProfileData(userId);
    if (profileData) {
      this.setState({ loading: false, reviewIdToOpen, ...profileData });
    }
  }

  render() {
    return (
      <PublicProfileContainer
        reviews={this.state.reviews}
        reviewIdToOpen={this.state.reviewIdToOpen}
        userDisplayName={this.state.userDisplayName}
        loading={this.state.loading}
        isOwnPage={this.state.isOwnPage}
        onChange={this.refreshData}
      />
    );
  }
}

export default PublicProfileRedux;

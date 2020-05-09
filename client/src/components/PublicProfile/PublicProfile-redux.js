import React, { Component } from 'react';
import axios from 'axios';
import PublicProfileContainer from './PublicProfile-container';

class PublicProfileRedux extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userDisplayName: '',
      reviews: null,
      loading: false,
    };

    this.refreshData = this.refreshData.bind(this);
  }

  componentDidMount() {
    this.refreshData();
  }

  async refreshData() {
    const { userId } = this.props.match.params;
    this.setState({ loading: true });
    const profileData = await this.getProfileData(userId);
    this.setState({ loading: false });

    if (profileData) {
      this.setState({
        userDisplayName: profileData.userDisplayName,
        reviews: profileData.reviews,
      });
    } else {
      this.setState({ reviews: null });
    }
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

  render() {
    return (
      <PublicProfileContainer
        reviews={this.state.reviews}
        userDisplayName={this.state.userDisplayName}
        loading={this.state.loading}
        onChange={this.refreshData}
      />
    );
  }
}

export default PublicProfileRedux;

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Col, notification, Row } from 'antd';
import { CalendarOutlined, DashboardOutlined, SmileOutlined, TeamOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom';
import LazyHero from 'react-lazy-hero';
import GoogleButton from '../GoogleButton';
import './Login.scss';

class Login extends Component {
  openNotification = () => {
    notification.open({
      message: 'Logout successful, see you soon!',
      icon: <SmileOutlined />,
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };

  componentDidMount() {
    if (this.props.justSignedOut) {
      this.openNotification();
    }
  }

  render() {
    if (this.props.auth) {
      return (
        <Redirect
          to={{
            pathname: '/dashboard',
            state: { from: this.props.location },
          }}
        />
      );
    }

    return (
      <div>
        <LazyHero
          className="login__lazy-hero"
          minHeight="80vh"
          opacity={0.7}
          parallaxOffset={100}
          imageSrc="https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1661&q=80"
        >
          <h1>Paper a Week</h1>
          <h5>Read a paper a week. That's it.</h5>
          <GoogleButton colorMode="dark" />
        </LazyHero>
        <div className="login__bottom-tray">
          <Row gutter={16} type="flex">
            <Col span={8}>
              <Card style={{ height: '100%' }}>
                <Card.Meta
                  avatar={<CalendarOutlined />}
                  title="Because reading papers is hard"
                  description="Make it easy with Paper-a-week. Find papers online, automatically import metadata, and fill out the review form to write one detailed review per week. Future you will thank you."
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Card.Meta
                  avatar={<TeamOutlined />}
                  title="Because you're smart"
                  description="Make your profile public to allow others to learn from your summaries and insights. Share interesting papers or find inspiration in other profiles!"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Card.Meta
                  avatar={<DashboardOutlined />}
                  title="Because we could all use some motivation"
                  description="Earn points by writing reviews on time and logging in every day."
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};

export default connect(mapStateToProps, null)(Login);

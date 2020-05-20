import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Col, notification, Row } from 'antd';
import { CalendarOutlined, DashboardOutlined, GoogleOutlined, SmileOutlined, TeamOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom';
import LazyHero from 'react-lazy-hero';
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
      <div style={{ position: 'absolute', top: '42px' }}>
        <LazyHero
          className="login__lazy-hero"
          minHeight="80vh"
          opacity={0.7}
          parallaxOffset={100}
          imageSrc="https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1661&q=80"
        >
          <h1>Paper a Week</h1>
          <h5>Read a paper a week. That's it.</h5>
          <Button href="/auth/google" size={'large'}>
            {' '}
            Sign in with <GoogleOutlined />{' '}
          </Button>
        </LazyHero>
        <div className="login__bottom-tray">
          <Row gutter={16} type="flex">
            <Col span={8}>
              <Card style={{ height: '100%' }}>
                <Card.Meta
                  avatar={<CalendarOutlined />}
                  title="Because reading papers is hard"
                  description="Make it easy with Paper-a-week. Use our search feature and wizard to write one detailed review per week. Future you will thank you!"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Card.Meta
                  avatar={<TeamOutlined />}
                  title="Because you're smart"
                  description="Make your profile public to allow others to learn from your summaries and insights!"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Card.Meta
                  avatar={<DashboardOutlined />}
                  title="Because we could all use some motivation"
                  description="Earn points by writing reviews on time and commenting on others!"
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

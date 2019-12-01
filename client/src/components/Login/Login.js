import React, { Component } from 'react';
import { Button, Card, Col, Icon, notification, Row } from 'antd';
import LazyHero from 'react-lazy-hero';
import { Redirect } from 'react-router-dom';
import './Login.scss';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectHome: false,
    };
  }

  signIn = () => {
    this.props.auth.getSession();
  };

  openNotification = () => {
    notification.open({
      message: 'Logout successful, see you soon!',
      icon: <Icon type="smile" />,
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };

  componentDidMount() {
    if (this.props.justSignedOut) {
      this.openNotification();
    }

    let token = this.props.auth.signInUserSession.idToken.jwtToken;
    fetch('/api/auth', {
      headers: {
        'content-type': 'application/json',
        idToken: token,
      },
    }).then(response => {
      if (response.ok) {
        this.setState({ redirectHome: true });
      }
    });
  }

  render() {
    if (this.state.redirectHome) {
      return <Redirect to="/dashboard" push />;
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
          <Button onClick={this.signIn} size={'large'}>
            {' '}
            Sign in with <Icon type="google" />{' '}
          </Button>
        </LazyHero>
        <div className="login__bottom-tray">
          <Row gutter={16} type="flex">
            <Col span={8}>
              <Card style={{ height: '100%' }}>
                <Card.Meta
                  avatar={<Icon type="calendar" />}
                  title="Because reading papers is hard"
                  description="Make it easy with Paper-a-week. Use our search feature and wizard to write one detailed review per week. Future you will thank you!"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Card.Meta
                  avatar={<Icon type="team" />}
                  title="Because you're smart"
                  description="Make your profile public to allow others to learn from your summaries and insights!"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Card.Meta
                  avatar={<Icon type="dashboard" />}
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

export default Login;

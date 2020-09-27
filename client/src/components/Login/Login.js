import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Col, notification, Row } from 'antd';
import { CalendarOutlined, SmileOutlined, TeamOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom';
import LazyHero from 'react-lazy-hero';
import GoogleButton from '../GoogleButton';
import './Login.scss';

const openNotification = () => {
  notification.open({
    message: 'Logout successful, see you soon!',
    icon: <SmileOutlined />,
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
};

export default function Login({ justSignedOut, location }) {
  useEffect(() => {
    if (justSignedOut) {
      openNotification();
    }
  });

  const auth = useSelector(state => state.auth);
  const redirect = (
    <Redirect
      to={{
        pathname: '/dashboard',
        state: { from: location },
      }}
    />
  );

  const login = (
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
          <Col span={12}>
            <Card style={{ height: '100%' }}>
              <Card.Meta
                avatar={<CalendarOutlined />}
                title="Because reading papers is hard"
                description="Make it easy with Paper-a-week. Find papers online, automatically import metadata, and fill out the review form to write one detailed review per week. Future you will thank you."
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Card.Meta
                avatar={<TeamOutlined />}
                title="Because you're smart"
                description="Make your profile public to allow others to learn from your summaries and insights. Share interesting papers or find inspiration in other profiles!"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
  return auth ? redirect : login;
}

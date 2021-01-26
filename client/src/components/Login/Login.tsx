/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Col, Popover, Row } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom';
import LazyHero from 'react-lazy-hero';
import { Location } from 'history';
import GoogleButton from 'react-google-button/dist/react-google-button';
import './Login.scss';
import { RootState } from '../../reducers';
import { Maybe } from '../../types';
import { blankUser } from '../../templates';
import background from './textured-background.png';
import logo from './logo.png';
import demo from './demo.png';
import { AuthState } from '../../reducers/reducer_auth';

interface LoginProps {
  location: Location;
}

const featureList = [
  'Find papers online, automatically import metadata, and write one review per week',
  'Search through reviews you’ve written',
  'Share your reviews with colleagues',
  'Our Review Form makes it easy to write thorough, structured reviews including Markdown and LaTeX',
];

export default function Login({ location }: LoginProps): Maybe<JSX.Element> {
  const { loading, user }: AuthState = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Instead of flashing a loading spinner for 1/4 second this is loading, just don't render anything
  if (loading) return null;

  if (user !== blankUser) {
    return (
      <Redirect
        to={{
          pathname: '/dashboard',
          state: { from: location },
        }}
      />
    );
  }

  const LoginButton = (
    <div className="modal-body">
      <a href="/auth/google">
        <GoogleButton type="dark" />
      </a>
    </div>
  );

  return (
    <div className="login-page">
      <LazyHero className="login__lazy-hero" minHeight="95vh" opacity={0.6} parallaxOffset={100} imageSrc={background}>
        <img className="logo" src={logo} alt="logo" />
        <Row gutter={16}>
          <Col md={8} offset={3} sm={24}>
            <ul className="feature-list">
              {featureList.map(feature => {
                return <li key={feature}>{feature}</li>;
              })}
            </ul>
          </Col>
          <Col md={12} sm={24}>
            <div className="product-title">
              <img src={demo} className="demo" alt="demo" />
              <h5>Read a paper a week. That's it.</h5>
              <Popover
                content={LoginButton}
                trigger="click"
                visible={isModalOpen}
                placement="top"
                onVisibleChange={() => setIsModalOpen(!isModalOpen)}
              >
                <Button shape="round" size="large" icon={<LoginOutlined />}>
                  Sign In
                </Button>
              </Popover>
            </div>
          </Col>
        </Row>
      </LazyHero>
    </div>
  );
}

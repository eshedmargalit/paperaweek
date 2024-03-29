/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Button, Col, Popover, Row } from 'antd';
import { ExperimentOutlined, LoginOutlined } from '@ant-design/icons';

import { Location } from 'history';
import GoogleButton from 'react-google-button/dist/react-google-button';
import './Login.scss';
import { Maybe } from '../../types';
import { blankUser } from '../../templates';
import logo from './logo.png';
import demo from './demo.png';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { AuthState } from '../../slices/authSlice';
import { enterDemoMode } from '../../actions';

interface LoginProps {
  location: Location;
}

const featureList = [
  'Find papers online, automatically import metadata, and write one review per week',
  'Search through reviews you’ve written',
  'Share your reviews with colleagues',
  'Write thorough, structured reviews with Markdown and LaTeX',
];

export default function Login({ location }: LoginProps): Maybe<JSX.Element> {
  const { loading, user }: AuthState = useAppSelector(({ auth }) => auth);
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { push } = useHistory();

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

  const handleDemo = () => {
    dispatch(enterDemoMode());
    push('/dashboard');
  };

  const LoginButton = (
    <div className="modal-body">
      <a href="/auth/google">
        <GoogleButton type="dark" />
      </a>
    </div>
  );

  return (
    <div className="login-page">
      <img className="logo" src={logo} alt="logo" />
      <Row gutter={16}>
        <Col md={8} offset={3} sm={24}>
          <ul className="feature-list">
            {featureList.map((feature) => {
              return <li key={feature}>{feature}</li>;
            })}
          </ul>
        </Col>
        <Col md={12} sm={24}>
          <div className="product-title">
            <img src={demo} className="demo" alt="demo" />
            <h5>Read a paper a week. That's it.</h5>
            <div className="login-page--actions">
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
              <div>
                <hr />
                Not ready to make an account yet? No problem!
              </div>
              <Button shape="round" size="middle" icon={<ExperimentOutlined />} onClick={handleDemo}>
                Try the Demo
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

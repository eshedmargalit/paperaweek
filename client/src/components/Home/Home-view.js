import React from 'react';
import { Redirect } from 'react-router-dom';
import PaperSearchBar from '../PaperSearchBar';
import ReadingList from '../ReadingList';
import ReviewReader from '../ReviewReader';
import { Row, Col } from 'antd';

import './Home.scss';

function HomeView({ auth, showForm }) {
  const formRedirect = <Redirect to="/form" push />;
  const homeRedirect = <Redirect to="/" push />;
  const home_render = (
    <div className="width80">
      <Row>
        <Col lg={{ span: '16' }} sm={{ span: '24' }}>
          <PaperSearchBar />
        </Col>
        <Col lg={{ span: '7', offset: '1' }} sm={{ span: '24' }}>
          <ReadingList />
        </Col>
      </Row>
      <Row>
        <Col>
          <ReviewReader />
        </Col>
      </Row>
    </div>
  );

  return auth ? (showForm ? formRedirect : home_render) : homeRedirect;
}

export default HomeView;

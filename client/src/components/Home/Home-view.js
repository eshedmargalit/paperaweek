import React from 'react';
import { Redirect } from 'react-router-dom';
import PaperSearchBar from '../PaperSearchBar';
import ReadingList from '../ReadingList';
import ReviewReader from '../ReviewReader';
import { Row, Col } from 'antd';

import './Home.scss';

export default function HomeView({ auth }) {
  const loginRedirect = <Redirect to="/" push />;
  const homeRender = (
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
        <Col span={24}>
          <ReviewReader />
        </Col>
      </Row>
    </div>
  );

  return auth ? homeRender : loginRedirect;
}

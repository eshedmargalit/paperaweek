import React from 'react';
import { Row, Col } from 'antd';
import PaperSearchBar from '../PaperSearchBar';
import ReadingList from '../ReadingList';
import ReviewReader from '../ReviewReader';

import './Home.scss';
import StatBox from '../StatBox';

export default function HomeView(): JSX.Element {
  return (
    <div className="width80">
      <Row>
        <Col lg={{ span: '16' }} sm={{ span: '24' }}>
          <PaperSearchBar />
          <StatBox />
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
}

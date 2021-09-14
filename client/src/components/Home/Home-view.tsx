import React from 'react';
import { Row, Col } from 'antd';
import PaperSearchBar from '../PaperSearchBar';
import ReadingList from '../ReadingList';
import ReviewReader from '../ReviewReader';

import './Home.scss';
import ReviewOfTheDay from '../ReviewOfTheDay';
import StatBox from '../StatBox';
import ProductTour from '../ProductTour/ProductTour';

export interface HomeViewProps {
  showTour?: boolean;
}

export default function HomeView({ showTour }: HomeViewProps): JSX.Element {
  return (
    <>
      {showTour && <ProductTour />}
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
        <hr />
        <Row>
          <Col span={24}>
            <ReviewOfTheDay />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col span={24}>
            <ReviewReader />
          </Col>
        </Row>
      </div>
    </>
  );
}

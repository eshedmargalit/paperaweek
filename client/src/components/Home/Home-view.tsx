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
        <Row justify="space-between">
          <Col lg={{ span: '15' }} sm={{ span: '24' }} className="home-section">
            <PaperSearchBar />
            <StatBox />
          </Col>
          <Col lg={{ span: '7' }} sm={{ span: '24' }} className="home-section">
            <ReadingList />
          </Col>
        </Row>
        <Row>
          <Col span={24} className="home-section">
            <ReviewOfTheDay />
          </Col>
        </Row>
        <Row>
          <Col span={24} className="home-section">
            <ReviewReader />
          </Col>
        </Row>
      </div>
    </>
  );
}

import React from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col } from 'antd';
import PaperSearchBar from '../PaperSearchBar';
import ReadingList from '../ReadingList';
import ReviewReader from '../ReviewReader';

import './Home.scss';
import { User } from '../../types';
import { blankUser } from '../../templates';

export interface HomeViewProps {
  user: User;
}

export default function HomeView({ user }: HomeViewProps): JSX.Element {
  if (user === blankUser) return <Redirect to="/" push />;

  return (
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
}

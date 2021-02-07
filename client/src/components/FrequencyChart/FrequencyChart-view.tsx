import React, { useState } from 'react';
import { Text, Label, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';
import { Row, Col, Card, Spin, Statistic, Menu, Dropdown, Space, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import moment, { Moment } from 'moment';
import { getReviewStats } from '../utils';
import { Maybe, Review } from '../../types';
import './FrequencyChart.scss';

interface FrequencyChartViewProps {
  reviews: Review[];
}

interface Gap {
  reviewIdx: number;
  date: Moment;
  gap: number;
}

const monthCutoffToString = (monthCutoff: Maybe<number>): string => {
  if (!monthCutoff) {
    return 'All Time';
  }

  if (monthCutoff === 12) {
    return 'Past Year';
  }

  return `Past ${monthCutoff} Months`;
};

export default function FrequencyChartView({ reviews }: FrequencyChartViewProps): JSX.Element {
  const [monthCutoff, setMonthCutoff] = useState<Maybe<number>>(6);

  const pastCutoff = moment().subtract(monthCutoff || 99999, 'months');
  const filteredReviews = reviews.filter(review => moment(review.createdAt).diff(pastCutoff) > 0);

  const reviewDates = filteredReviews.map(review => moment(review.createdAt));
  const sortedDates = reviewDates.sort((a, b) => a.diff(b));

  const data: Gap[] = [];
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diffHours = sortedDates[i + 1].diff(sortedDates[i], 'hours');
    const diffDays = diffHours / 24;
    data.push({ reviewIdx: i + 1, date: sortedDates[i + 1], gap: diffDays });
  }

  const yAxisText = (
    <Text x={0} y={0} dx={40} dy={150} offset={0} angle={-90}>
      Days Between Reviews
    </Text>
  );

  let chart = <Spin />;

  if (data.length) {
    chart = (
      <div style={{ display: 'block', lineHeight: 0 }}>
        <ResponsiveContainer width="100%" height={195}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 15,
            }}
          >
            {/* For some reason, the type for XAxis doesn't allow for children, but if it works, it works */}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <XAxis dataKey="reviewIdx">
              <Label value="Review Number" offset={-15} position="insideBottom" />
            </XAxis>
            <YAxis label={yAxisText} />
            <Line type="monotone" dot={false} strokeWidth={3} dataKey="gap" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const { numReviews, ppwString, ppwColor } = getReviewStats(filteredReviews);

  const statRender = (
    <div style={{ marginLeft: '10px' }}>
      <div style={{ width: '50%' }}>
        <Statistic title="Reviews" value={numReviews} suffix="written" />
      </div>
      <hr />
      <div style={{ width: '50%' }}>
        <Statistic title="Papers per Week" value={ppwString} valueStyle={{ color: ppwColor }} suffix="/ week" />
      </div>
    </div>
  );
  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={() => setMonthCutoff(3)}>
        Last 3 Months
      </Menu.Item>
      <Menu.Item key="1" onClick={() => setMonthCutoff(6)}>
        Last 6 Months
      </Menu.Item>
      <Menu.Item key="2" onClick={() => setMonthCutoff(12)}>
        Last Year
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4" onClick={() => setMonthCutoff(null)}>
        All Time
      </Menu.Item>
    </Menu>
  );

  const cardTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>Your Stats</span>
      <div style={{ float: 'right' }}>
        Showing{` `}
        <Dropdown overlay={menu}>
          <Button className="ant-dropdown-link">
            {monthCutoffToString(monthCutoff)} <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    </div>
  );

  return (
    <div className="frequency-chart">
      <Card title={cardTitle} style={{ marginTop: 5 }}>
        <Row>
          <Col lg={16} sm={24} xs={24}>
            {' '}
            {chart}
          </Col>
          <Col lg={8} sm={24} xs={24}>
            {' '}
            {statRender}
          </Col>
        </Row>
      </Card>
    </div>
  );
}

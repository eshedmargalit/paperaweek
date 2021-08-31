import React, { useState } from 'react';
import { Text, Label, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';
import { Alert, Row, Col, Card, Spin, Statistic, Menu, Dropdown, Button } from 'antd';
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

type MonthCutoff = 3 | 6 | 12;
const monthCutoffToString = (monthCutoff: Maybe<MonthCutoff>): string => {
  if (!monthCutoff) {
    return 'All Time';
  }

  if (monthCutoff === 12) {
    return 'Past Year';
  }

  return `Past ${monthCutoff} Months`;
};

export default function FrequencyChartView({ reviews }: FrequencyChartViewProps): JSX.Element {
  const [monthCutoff, setMonthCutoff] = useState<Maybe<MonthCutoff>>(6);

  const pastCutoff = moment().subtract(monthCutoff || 99999, 'months');
  const filteredReviews = reviews.filter((review) => moment(review.createdAt).diff(pastCutoff) > 0);

  const dropdown = (
    <Menu>
      <Menu.Item key="0" onClick={() => setMonthCutoff(3)}>
        Past 3 Months
      </Menu.Item>
      <Menu.Item key="1" onClick={() => setMonthCutoff(6)}>
        Past 6 Months
      </Menu.Item>
      <Menu.Item key="2" onClick={() => setMonthCutoff(12)}>
        Past Year
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4" onClick={() => setMonthCutoff(null)}>
        All Time
      </Menu.Item>
    </Menu>
  );

  const cardTitle = (
    <div className="card-title">
      <h5>Your Stats</h5>
      <div>
        Showing{` `}
        <Dropdown overlay={dropdown}>
          <Button className="ant-dropdown-link">
            {monthCutoffToString(monthCutoff)} <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    </div>
  );

  if (filteredReviews.length < 3) {
    return (
      <div className="frequency-chart">
        <Card title={cardTitle}>
          <Row>
            <Col>
              <Alert
                message="Not Enough Reviews in Time Window"
                description="You need at least 3 reviews in the specified time period for statistics to appear."
                type="info"
                showIcon
              />
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
  const reviewDates = filteredReviews.map((review) => moment(review.createdAt));
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
      <div className="chart">
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
    <div className="stats">
      <Statistic title="Reviews" value={numReviews} suffix="written" />
      <hr />
      <Statistic title="Papers per Week" value={ppwString} valueStyle={{ color: ppwColor }} suffix="/ week" />
    </div>
  );

  return (
    <div className="frequency-chart">
      <Card title={cardTitle}>
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

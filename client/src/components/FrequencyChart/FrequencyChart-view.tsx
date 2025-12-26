import React, { useState } from 'react';
import { Text, Label, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';
import { Alert, Row, Col, Card, Spin, Statistic, Dropdown, Button } from 'antd';
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

  const menuItems = [
    {
      key: '0',
      label: 'Past 3 Months',
      onClick: () => setMonthCutoff(3),
    },
    {
      key: '1',
      label: 'Past 6 Months',
      onClick: () => setMonthCutoff(6),
    },
    {
      key: '2',
      label: 'Past Year',
      onClick: () => setMonthCutoff(12),
    },
    {
      type: 'divider' as const,
    },
    {
      key: '4',
      label: 'All Time',
      onClick: () => setMonthCutoff(null),
    },
  ];

  const cardTitle = (
    <div className="card-title">
      <h5>Your Stats</h5>
      <div>
        Showing{` `}
        <Dropdown menu={{ items: menuItems }}>
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

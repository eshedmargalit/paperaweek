import React from 'react';
import { Text, Label, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';
import { Row, Col, Card, Spin, Statistic } from 'antd';
import moment, { Moment } from 'moment';
import { getReviewStats } from '../utils';
import { Review } from '../../types';

interface FrequencyChartViewProps {
  reviews: Review[];
}

interface Gap {
  reviewIdx: number;
  date: Moment;
  gap: number;
}

export default function FrequencyChartView({ reviews }: FrequencyChartViewProps): JSX.Element {
  const reviewDates = reviews.map(review => moment(review.createdAt));
  const sortedDates = reviewDates.sort((a, b) => a.diff(b));

  const data: Gap[] = [];
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = sortedDates[i + 1].diff(sortedDates[i], 'days');
    data.push({ reviewIdx: i + 1, date: sortedDates[i + 1], gap: diff });
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
            <Line type="monotone" dot={false} strokeWidth={3} dataKey="gap" stroke="#4984ee" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const { numReviews, ppwString, ppwColor } = getReviewStats(reviews);

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

  return (
    <Card title="Your Stats" style={{ marginTop: 5 }}>
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
  );
}

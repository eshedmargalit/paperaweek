import React from 'react';
import { Text, Label, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';
import { Row, Col, Card, Spin, Statistic } from 'antd';
import { getReviewStats } from '../utils';
import moment from 'moment';

function FrequencyChartView(reviews) {
  const lineChart = reviews => {
    const reviewDates = reviews.map(review => moment(review.createdAt));
    const sortedDates = reviewDates.sort((a, b) => a.diff(b));

    let data = [];
    for (var i = 0; i < sortedDates.length - 1; i++) {
      var diff = sortedDates[i + 1].diff(sortedDates[i], 'days');
      data.push({ reviewIdx: i + 1, date: sortedDates[i + 1], gap: diff });
    }

    let chart = <Spin />;
    if (data) {
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
              <XAxis dataKey="reviewIdx">
                <Label value="Review Number" offset={-15} position="insideBottom" />
              </XAxis>
              <YAxis
                label={
                  <Text x={0} y={0} dx={40} dy={150} offset={0} angle={-90}>
                    Days Between Reviews
                  </Text>
                }
              />
              <Line type="monotone" dot={false} strokeWidth={3} dataKey="gap" stroke="#4984ee" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    const { numReviews, ppw, ppwColor } = getReviewStats(reviews);
    const statRender = (
      <div style={{ marginLeft: '10px' }}>
        <div style={{ width: '50%' }}>
          <Statistic title="Reviews" value={numReviews} suffix="written" />
        </div>
        <hr />
        <div style={{ width: '50%' }}>
          <Statistic title="Papers per Week" value={ppw} valueStyle={{ color: ppwColor }} suffix="/ week" />
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
  };

  return lineChart(reviews);
}

export default FrequencyChartView;

import React from 'react';
import { Text, Label, ReferenceLine, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';
import { Row, Col, Card, Spin, Statistic } from 'antd';
import moment from 'moment';

function getReviewStats(reviews) {
  if (reviews.reviewList.length === 0) {
    return null;
  }

  const reviewDates = reviews.reviewList.map(review => moment(review.createdAt));
  const sortedDates = reviewDates.sort((a, b) => a.diff(b));

  let diffs = [];
  for (var i = 0; i < sortedDates.length - 1; i++) {
    var diff = sortedDates[i + 1].diff(sortedDates[i], 'days');
    diffs.push(diff);
  }

  const totalWeeks = sortedDates[sortedDates.length - 1].diff(sortedDates[0], 'days') / 7.0;
  const ppw = Number.parseFloat(sortedDates.length / totalWeeks).toFixed(2);

  const ppwColor = ppw >= 1 ? '#237804' : '#a8071a';

  return (
    <>
      <br />
      <div style={{ marginLeft: '10px' }}>
        <div style={{ width: '50%' }}>
          <Statistic title="Reviews" value={reviews.reviewList.length} suffix="written" />
        </div>
        <hr />
        <div style={{ width: '50%' }}>
          <Statistic title="Papers per Week" value={ppw} valueStyle={{ color: ppwColor }} suffix="/ week" />
        </div>
      </div>
    </>
  );
}

function FrequencyChartView(reviews) {
  const lineChart = reviews => {
    const reviewDates = reviews.reviewList.map(review => moment(review.createdAt));
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
                    Gap Between Reviews
                  </Text>
                }
              />
              <ReferenceLine y={7} strokeDasharray="3 3" strokeWidth={3} stroke="#237804" />
              <Line strokeWidth={5} dataKey="gap" stroke="#888888" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return (
      <Card title="Your Stats" style={{ marginTop: 5 }}>
        <Row>
          <Col lg={16} sm={24}>
            {' '}
            {chart}
          </Col>
          <Col lg={8} sm={24}>
            {' '}
            {getReviewStats(reviews)}
          </Col>
        </Row>
      </Card>
    );
  };

  return lineChart(reviews);
}

export default FrequencyChartView;

import React from 'react';
import {
  Text,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Spin, Icon, Tooltip, Statistic } from 'antd';
import moment from 'moment';
import _ from 'lodash';

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
      <h5>Your Stats</h5>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>
          <Statistic title="Reviews" value={reviews.reviewList.length} suffix="written" />
        </div>

        <div style={{ width: '50%' }}>
          <Statistic title="Papers per Week" value={ppw} valueStyle={{ color: ppwColor }} suffix="/ week" />
        </div>
      </div>
      <div style={{ display: 'flex' }}></div>
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
      data.push({ date: sortedDates[i + 1], gap: diff });
    }

    let chart = <Spin />;
    if (data) {
      chart = (
        <div style={{ display: 'block', lineHeight: 0 }}>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 15,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis>
                <Label value="Review Number" offset={-5} position="insideBottom" />
              </XAxis>
              <YAxis
                label={
                  <Text x={0} y={0} dx={40} dy={120} offset={0} angle={-90}>
                    Gap Between Reviews
                  </Text>
                }
              />
              <Line strokeWidth={5} dataKey="gap" stroke="#888888" />
              <ReferenceLine y={7} strokeDasharray="3 3" strokeWidth={3} stroke="#237804" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    const toolTipText =
      "The height of each bar indicates how often you take a break of that length between reviews. If you review exactly once per week, the only bar will be at 7! Less than 7 means you're reading more than one paper per week, and more than 7 means you're taking longer than a week between papers.";
    const infoIcon = (
      <Tooltip title={toolTipText}>
        <Icon type="info-circle" />
      </Tooltip>
    );

    return (
      <div style={{ lineHeight: 1 }}>
        <h5> How Close Are You to One Paper per Week? {infoIcon} </h5>
        <hr />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '100%' }}>{chart}</div>
          <div style={{ width: '100%' }}>{getReviewStats(reviews)}</div>
        </div>
      </div>
    );
  };

  return lineChart(reviews);
}

export default FrequencyChartView;

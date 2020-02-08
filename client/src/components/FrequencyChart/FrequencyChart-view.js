import React from 'react';
import { Text, Label, ReferenceLine, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Spin, Icon, Tooltip, Statistic } from 'antd';
import moment from 'moment';
import _ from 'lodash';

function computeDiffHistogram(reviews) {
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

  // tally histogram
  const counts = _.countBy(diffs);
  const maxDiff = _.max(diffs);

  let data = [];
  for (var d = 0; d < maxDiff - 1; d++) {
    let diffCount = counts[d];
    if (diffCount) {
      data.push({ diff: d, count: diffCount });
    } else {
      data.push({ diff: d, count: 0 });
    }
  }

  return data;
}

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

  const meanDiff = _.mean(diffs);
  const totalWeeks = sortedDates[sortedDates.length - 1].diff(sortedDates[0], 'days') / 7.0;
  const ppw = Number.parseFloat(sortedDates.length / totalWeeks).toFixed(2);

  return (
    <>
      <h5>Your Stats</h5>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>
          <Statistic title="Reviews" value={reviews.reviewList.length} suffix="written" />
        </div>

        <div style={{ width: '50%' }}>
          <Statistic title="Mean Time Between Reviews" value={meanDiff} suffix="days" />
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>
          <Statistic title="Papers per Week" value={ppw} suffix="/ week" />
        </div>
      </div>
    </>
  );
}

function FrequencyChartView(reviews) {
  const barChart = reviews => {
    const diffHistogram = computeDiffHistogram(reviews);

    let chart = <Spin />;
    if (diffHistogram) {
      const ticks = diffHistogram.map(bar => {
        return bar.diff;
      });

      chart = (
        <div style={{ display: 'block', lineHeight: 0 }}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={diffHistogram}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 15,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis ticks={ticks}>
                <Label value="Gap Length" offset={-5} position="insideBottom" />
              </XAxis>
              <YAxis
                label={
                  <Text x={0} y={0} dx={40} dy={120} offset={0} angle={-90}>
                    Number of Gaps
                  </Text>
                }
              />
              <Bar dataKey="count" fill="#4984ee" />
              <ReferenceLine x={7} strokeWidth={3} />
            </BarChart>
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

  return barChart(reviews);
}

export default FrequencyChartView;

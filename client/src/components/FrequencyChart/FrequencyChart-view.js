import React from 'react';
import { Label, ReferenceLine, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Spin, Icon, Tooltip } from 'antd';
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
  for (var diff = 0; diff < maxDiff - 1; diff++) {
    let diffCount = counts[diff];
    if (diffCount) {
      data.push({ diff: diff, count: diffCount });
    } else {
      data.push({ diff: diff, count: 0 });
    }
  }

  return data;
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
        <div style={{ lineHeight: 0 }}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={diffHistogram}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis ticks={ticks}>
                <Label value="Days Between Reviews" offset={-5} position="insideBottom" />
              </XAxis>
              <YAxis />
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
        {chart}
      </div>
    );
  };

  return barChart(reviews);
}

export default FrequencyChartView;

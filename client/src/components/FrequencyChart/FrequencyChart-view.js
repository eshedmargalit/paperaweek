import React from 'react';
import {
  ReferenceLine,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import moment from 'moment';
import _ from 'lodash';

function FrequencyChartView(reviews) {
  const barChart = reviews => {
    if (reviews.reviewList.length === 0) {
      return <div> WAIT </div>;
    }

    const reviewDates = reviews.reviewList.map(review => moment(review.createdAt));
    const sortedDates = reviewDates.sort((a, b) => a.diff(b));

    let diffs = [];
    for (var i = 0; i < sortedDates.length - 1; i++) {
      var diff = sortedDates[i + 1].diff(sortedDates[i], 'days');
      diffs.push(diff);
    }

    // tally histogram
    console.log(reviews);
    console.log(reviewDates);
    console.log(sortedDates);
    console.log(diffs);
    const counts = _.countBy(diffs);
    console.log(counts);

    let ticks = [];
    let countValues = [];
    for (const diff in counts) {
      ticks.push(parseInt(diff));
      countValues.push(counts[diff]);
    }

    const data = countValues.map(count => {
      return { value: count };
    });

    console.log(ticks);

    return (
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis ticks={ticks} />
          <YAxis />
          <Bar dataKey="value" fill="#8884d8" />
          <ReferenceLine x={7} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return barChart(reviews);
}

export default FrequencyChartView;

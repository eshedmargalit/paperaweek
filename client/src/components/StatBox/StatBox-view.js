import React from 'react';

import FrequencyChart from '../FrequencyChart';

import './StatBox.scss';

function StatBoxView({ reviews }) {
  const frequencyChart = FrequencyChart(reviews);
  return <div>{frequencyChart}</div>;
}

export default StatBoxView;

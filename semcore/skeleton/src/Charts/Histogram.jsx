import React from 'react';
import createComponent, { Root, sstyled } from '@semcore/core';
import { Skeleton } from '../Skeleton';
import styles from '../style/chart.shadow.css';

const verticalPattern = preval`
module.exports = btoa(require('fs').readFileSync(__dirname + '/../svg/histogram-chart-vertical.svg'))
`;
const horizontalPattern = preval`
module.exports = btoa(require('fs').readFileSync(__dirname + '/../svg/histogram-chart-horizontal.svg'))
`;

const HistogramChartSkeleton = (props) => {
  const SChartSkeleton = Root;
  const layout = props.layout ?? 'horizontal';
  const patternBase64 = { vertical: verticalPattern, horizontal: horizontalPattern }[layout];
  return sstyled(styles)(
    <SChartSkeleton
      render={Skeleton}
      bgRepeat={{ vertical: 'repeat-y', horizontal: 'repeat-x' }[layout]}
      bgPosition={{ vertical: 'left top', horizontal: 'left bottom' }[layout]}
      bgSize={{ vertical: '50% auto', horizontal: 'auto 50%' }[layout]}
      bgPattern={`url(data:image/svg+xml;base64,${patternBase64})`}
    />,
  );
};

export default createComponent(HistogramChartSkeleton);

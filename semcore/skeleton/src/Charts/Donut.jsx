import React from 'react';
import createComponent, { Root, sstyled } from '@semcore/core';
import { Skeleton } from '../Skeleton';
import styles from '../style/chart.shadow.css';

const fullSvg = preval`
module.exports = btoa(require('fs').readFileSync(__dirname + '/../svg/donut-chart.svg'))
`;
const halfSvg = preval`
module.exports = btoa(require('fs').readFileSync(__dirname + '/../svg/donut-chart-halfsize.svg'))
`;

const DonutChartSkeleton = (props) => {
  const SChartSkeleton = Root;
  const halfsize = props.halfsize ?? false;
  const patternBase64 = { true: halfSvg, false: fullSvg }[halfsize];
  return sstyled(styles)(
    <SChartSkeleton
      render={Skeleton}
      bgRepeat='no-repeat'
      bgPosition={{ true: 'center bottom', false: 'center' }[halfsize]}
      bgSize='contain'
      bgPattern={`url(data:image/svg+xml;base64,${patternBase64})`}
    />,
  );
};

export default createComponent(DonutChartSkeleton);

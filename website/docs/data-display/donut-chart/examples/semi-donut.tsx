import React from 'react';
import { Plot, Donut, colors } from '@semcore/ui/d3-chart';
import { Text } from '@semcore/ui/typography';
import { Flex } from '@semcore/ui/flex-box';

export default () => {
  return (
    <Plot width={300} height={150} data={data}>
      <Donut halfsize innerRadius={100}>
        <Donut.Pie dataKey='a' name='Pie 1' />
        <Donut.Pie dataKey='b' color={colors['green-02']} name='Pie 2' />
        <Donut.Pie dataKey='c' color={colors['violet-04']} name='Pie 3' />
        <Donut.Label label='71,240 engagements'>
          <Text tag='tspan' x='0' dy='-1.2em' fill='#191b23' size={600}>
            71,240
          </Text>
          <Text tag='tspan' x='0' dy='1.2em' fill='#6c6e79' size={200}>
            Engagements
          </Text>
        </Donut.Label>
      </Donut>
      <Donut.Tooltip>
        {({ dataKey, name }) => {
          return {
            children: (
              <>
                <Donut.Tooltip.Title>{name}</Donut.Tooltip.Title>
                <Flex justifyContent='space-between'>
                  <Text bold>{data[dataKey]}</Text>
                </Flex>
              </>
            ),
          };
        }}
      </Donut.Tooltip>
    </Plot>
  );
};

const data = {
  a: 3,
  b: 1,
  c: 2,
};

import { Flex } from '@semcore/flex-box';
import { Intergalactic } from '@semcore/core';
import Icon from '@semcore/icon';
import { Text } from '@semcore/typography';
import { LSize } from '../BaseLegend.type';

/**
 * Key of chart data item
 */
export type LegendItemKey = string;

export type LegendItem = {
  /**
   * One of keys from data set
   */
  id: LegendItemKey;
  /**
   * Label for data item in Legend
   */
  label: string;
  /**
   * Flag for selected data item
   */
  checked: boolean;
  /**
   * Color of data item
   */
  color: string;
  /**
   * Icon before label
   */
  icon?: typeof Icon;
  /**
   * Additional info with sub-label or count
   */
  additionalInfo?: { label: string } | { count: number };
};

export type LegendItemProps = LegendItem & {
  /**
   * Size for legend item
   */
  size: LSize;
  /**
   * Shape of data item on Legend panel
   */
  shape: ShapeType;
};

export type ShapeProps = LegendItem & {
  size: LSize;
  shape: ShapeType;
};

export const StaticShapes = ['Circle', 'Line', 'Square'] as const;

export type ShapeType =
  | 'Checkbox'
  | typeof StaticShapes[number]
  | Intergalactic.Component<Intergalactic.InternalTypings.ComponentTag, LegendItem>;

export type LegendItemType = Intergalactic.Component<typeof Flex, LegendItemProps> & {
  Shape: Intergalactic.Component<Intergalactic.InternalTypings.ComponentTag, ShapeProps>;
  Icon: Intergalactic.Component<typeof Icon, LegendItem>;
  Label: Intergalactic.Component<typeof Text, Omit<LegendItem, 'theme'>>;
  AdditionalLabel: Intergalactic.Component<typeof Text, LegendItem>;
  Count: Intergalactic.Component<typeof Text, LegendItem>;
};

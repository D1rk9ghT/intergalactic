import React from 'react';
import Switch from '@semcore/ui/switch';
import CheckM from '@semcore/ui/icon/Check/m';
import PlaygroundGeneration from '@components/PlaygroundGeneration';

export default PlaygroundGeneration(
  (createGroupWidgets) => {
    const { bool, select, radio, text, onChange } = createGroupWidgets('Switch');

    const size = radio({
      key: 'size',
      defaultValue: 'l',
      label: 'Size',
      options: ['m', 'l', 'xl'],
    });

    const theme = select({
      key: 'theme',
      defaultValue: 'success',
      label: 'Theme',
      options: ['info', 'success'].map((v) => ({ value: v, name: v })),
    });

    const checked = bool({
      key: 'checked',
      defaultValue: false,
      label: 'Checked',
    });

    const icon = bool({ key: 'children', defaultValue: false, label: 'Icon' });

    const before = text({
      key: 'before',
      label: 'AddonLeft',
      defaultValue: 'Off',
    });

    const after = text({
      key: 'after',
      label: 'AddonRight',
      defaultValue: 'On',
    });

    const disabled = bool({
      key: 'disabled',
      defaultValue: false,
      label: 'Disabled',
    });

    return (
      <Switch theme={theme} size={size}>
        {before && <Switch.Addon>{before}</Switch.Addon>}
        <Switch.Value
          disabled={disabled}
          checked={checked}
          onChange={(value) => onChange('checked', value)}
        >
          {icon && <CheckM />}
        </Switch.Value>
        {after && <Switch.Addon>{after}</Switch.Addon>}
      </Switch>
    );
  },
  {
    filterProps: ['onCheckedChange'],
  },
);

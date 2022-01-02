import React from 'react';
import cx from 'classnames';
import { ThemeColor } from '../../theming/themes';
import { configByTheme } from './ThemePicker.utils';

interface ColorButtonProps {
  color: ThemeColor;
  isSelected: boolean;
  onClick: (newColor: ThemeColor) => void;
}

export default function ColorButton({ color, isSelected, onClick }: ColorButtonProps): JSX.Element {
  const { backgroundColor, borderColor } = configByTheme[color];

  return (
    <button
      type="button"
      className={cx('pickButton', { isSelected })}
      aria-label={`theme picker color ${color}`}
      onClick={() => onClick(color)}
      style={{
        background: backgroundColor,
        border: `0.1rem solid ${borderColor}`,
      }}
    />
  );
}

import React from 'react';
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
      className="pickButton"
      aria-label={`theme picker color ${color}`}
      onClick={() => onClick(color)}
      style={{
        background: backgroundColor,
        border: `0.1rem solid ${borderColor}`,
        width: isSelected ? '1.25rem' : '1rem',
        height: isSelected ? '1.25rem' : '1rem',
      }}
    />
  );
}

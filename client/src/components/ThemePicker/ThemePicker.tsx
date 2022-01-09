import React from 'react';
import { ThemeColor } from '../../theming/themes';
import ThemeColorButton from './ThemeColorButton';
import './ThemePicker.scss';

interface ThemePickerProps {
  themes: readonly ThemeColor[];
  current: ThemeColor;
  onClick: (newColor: ThemeColor) => void;
}

export default function ThemePicker({ themes, current, onClick }: ThemePickerProps): JSX.Element {
  return (
    <div className="themePicker">
      {themes.map((c) => (
        <ThemeColorButton color={c} isSelected={c === current} onClick={onClick} key={`theme-color-${c}`} />
      ))}
    </div>
  );
}

import React from 'react';
import { ThemeColor } from '../../theming/themes';
import './ThemePicker.scss';

type ThemeConfig = {
  borderColor: string;
  backgroundColor: string;
};

const configByTheme: Record<ThemeColor, ThemeConfig> = {
  blue: { borderColor: '#194362', backgroundColor: '#22577E' },
  green: { borderColor: '#004d40', backgroundColor: '#00b295' },
  red: { borderColor: '#8e0b01', backgroundColor: '#bf0e01' },
  pink: { borderColor: '#ef306c', backgroundColor: '#F2789F' },
};

interface ColorButtonProps {
  color: ThemeColor;
  isSelected: boolean;
  onClick: (newColor: ThemeColor) => void;
}

function ColorButton({ color, isSelected, onClick }: ColorButtonProps): JSX.Element {
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
interface ThemePickerProps {
  themes: readonly ThemeColor[];
  current: ThemeColor;
  onClick: (newColor: ThemeColor) => void;
}

export default function ThemePicker({ themes, current, onClick }: ThemePickerProps): JSX.Element {
  return (
    <div className="themePicker">
      {themes.map((c) => (
        <ColorButton color={c} isSelected={c === current} onClick={onClick} />
      ))}
    </div>
  );
}

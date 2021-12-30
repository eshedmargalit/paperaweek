import React from 'react';
import './ThemePicker.scss';

const colors = ['red', 'blue', 'yellow', 'green'] as const;
type ThemeColor = typeof colors[number];

const borderColorByBackground: Record<ThemeColor, string> = {
  blue: 'black',
  green: 'black',
  red: 'black',
  yellow: 'black',
};

interface ColorButtonProps {
  color: ThemeColor;
}

function ColorButton({ color }: ColorButtonProps): JSX.Element {
  return (
    <span
      className="pickButton"
      aria-label={`theme picker color ${color}`}
      style={{
        background: color,
        border: `0.1rem solid ${borderColorByBackground[color]}`,
      }}
    />
  );
}

export default function ThemePicker(): JSX.Element {
  return (
    <div className="themePicker">
      {colors.map((c) => (
        <ColorButton color={c} />
      ))}
    </div>
  );
}

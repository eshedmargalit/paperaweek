import { ThemeColor } from '../../theming/themes';

type ThemeConfig = {
  borderColor: string;
  backgroundColor: string;
};

export const configByTheme: Record<ThemeColor, ThemeConfig> = {
  blue: { borderColor: '#194362', backgroundColor: '#22577E' },
  green: { borderColor: '#004d40', backgroundColor: '#00b295' },
  red: { borderColor: '#8e0b01', backgroundColor: '#bf0e01' },
  pink: { borderColor: '#ef306c', backgroundColor: '#F2789F' },
};

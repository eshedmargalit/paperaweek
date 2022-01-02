import { ThemeColor } from '../../theming/themes';

type ThemeConfig = {
  borderColor: string;
  backgroundColor: string;
};

export const configByTheme: Record<ThemeColor, ThemeConfig> = {
  blue: { borderColor: '#194362', backgroundColor: '#22577E' },
  green: { borderColor: '#004d40', backgroundColor: '#00b295' },
  orange: { borderColor: '#d08802', backgroundColor: 'orange' },
  pink: { borderColor: '#ef306c', backgroundColor: '#F2789F' },
};

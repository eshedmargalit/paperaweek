import { getFromLocalStorage, saveToLocalStorage } from '../storage';

export const themes = ['orange', 'blue', 'pink', 'green'] as const;
export type ThemeColor = typeof themes[number];

export function getPersistedTheme(): ThemeColor | null {
  const persisted = getFromLocalStorage('theme');
  if (persisted && themes.find((themeColor) => themeColor === persisted)) {
    return persisted as ThemeColor;
  }
  // eslint-disable-next-line no-console
  console.error('saved theme is not a valid theme');
  return null;
}

export function saveTheme(newColor: ThemeColor): void {
  try {
    saveToLocalStorage('theme', newColor);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`Failed to save theme: ${(e as Error).message}`);
  }
}

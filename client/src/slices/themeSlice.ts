import { createSlice } from '@reduxjs/toolkit';
import { themes, getPersistedTheme, ThemeColor } from '../theming/themes';

export type ThemeState = {
  themes: readonly ThemeColor[];
  currentTheme: ThemeColor;
};

const initialState: ThemeState = {
  themes,
  currentTheme: getPersistedTheme() || 'green',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    updateTheme: (_state, { payload }: { payload: ThemeColor }) => ({
      themes,
      currentTheme: payload,
    }),
  },
});

export const { updateTheme } = themeSlice.actions;

export default themeSlice.reducer;

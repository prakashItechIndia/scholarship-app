/**
 * Theme Configuration Index
 * Exports theme configurations and utilities
 */
export { lightTheme, type LightTheme } from './lightTheme';
export { darkTheme, type DarkTheme } from './darkTheme';

export type ThemeTokens = LightTheme | DarkTheme;

export type ThemeMode = 'light' | 'dark';

/**
 * Get theme tokens based on theme mode
 * @param mode - Theme mode ('light' or 'dark')
 * @returns Theme tokens for the appropriate theme
 */
export const getThemeTokens = (mode: ThemeMode): ThemeTokens => {
  return mode === 'dark' ? darkTheme : lightTheme;
};


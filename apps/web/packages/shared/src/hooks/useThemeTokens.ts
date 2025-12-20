import { useMemo } from 'react';
import { useDarkMode } from './useDarkMode';
import { getThemeTokens, ThemeTokens } from '../config/theme';

/**
 * Hook to get theme tokens based on current theme mode
 * Returns theme tokens that automatically update when theme changes
 */
export const useThemeTokens = (): ThemeTokens => {
  const isDark = useDarkMode();
  const mode = isDark ? 'dark' : 'light';
  
  return useMemo(() => getThemeTokens(mode), [mode]);
};


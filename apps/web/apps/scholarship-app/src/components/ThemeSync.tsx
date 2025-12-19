import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

/**
 * ThemeSync component that syncs the theme from ThemeProvider
 * with the document's classList for Tailwind dark mode
 * 
 * This component ensures:
 * 1. Theme changes are synced to document class immediately
 * 2. Theme from localStorage is loaded on mount (for auth pages after logout)
 * 3. URL theme parameter takes precedence (for cross-app navigation)
 * 4. Theme persists across logout/login cycles
 */
export const ThemeSync = () => {
  const { theme, setTheme } = useTheme();
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Listen to system theme preference changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const update = (event: MediaQueryListEvent | MediaQueryList) => {
      setSystemPrefersDark(event.matches);
    };

    update(mediaQuery);
    const listener = (event: MediaQueryListEvent) => update(event);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Load theme from URL parameter on mount (for cross-app navigation)
  // URL theme parameter takes precedence over stored theme
  useEffect(() => {
    if (isInitialized) return;

    // First, check for theme in URL (passed from Experience App) - URL takes precedence
    const searchParams = new URLSearchParams(window.location.search);
    const themeParam = searchParams.get('theme');

    if (
      themeParam &&
      (themeParam === 'light' || themeParam === 'dark' || themeParam === 'system')
    ) {
      setTheme(themeParam);
      setIsInitialized(true);
      return;
    }

    setIsInitialized(true);
  }, [setTheme, isInitialized]);

  // Sync theme to document class for Tailwind dark mode
  // This runs whenever theme or system preference changes
  // Note: ThemeProvider already handles adding/removing 'light' and 'dark' classes,
  // but we also need to handle the 'dark' class for Tailwind dark mode
  useEffect(() => {
    const root = document.documentElement;
    const resolvedTheme =
      theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;
    const isDark = resolvedTheme === 'dark';

    // Ensure 'dark' class is present for Tailwind dark mode
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, systemPrefersDark]);

  return null;
};

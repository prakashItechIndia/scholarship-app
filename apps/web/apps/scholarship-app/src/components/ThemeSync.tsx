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
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isInitialized, setIsInitialized] = useState(false);

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

  // ThemeProvider now handles the class syncing, so this component mainly
  // handles URL parameter initialization
  // The resolvedTheme from ThemeProvider is already synced to the document class

  return null;
};

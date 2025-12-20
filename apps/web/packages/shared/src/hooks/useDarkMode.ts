import { useEffect, useState } from 'react';

/**
 * Hook to detect if dark mode is currently active
 * Checks for the 'dark' class on the document element (used by Tailwind)
 */
export const useDarkMode = (): boolean => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    // Observe changes to the classList of the document element
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
};


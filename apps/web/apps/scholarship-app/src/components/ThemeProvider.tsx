import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { lightTheme, darkTheme, type ThemeTokens } from "@shared/config/theme";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
  tokens: ThemeTokens;
};

const initialState: ThemeProviderState = {
  theme: "light",
  resolvedTheme: "light",
  setTheme: () => null,
  tokens: lightTheme,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

const isBrowser = () => typeof window !== "undefined" && typeof window.document !== "undefined";

const getStoredTheme = (key: string, fallback: Theme): Theme => {
  if (!isBrowser()) {
    return fallback;
  }

  const stored = window.localStorage.getItem(key) as Theme | null;
  return stored ?? fallback;
};

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "icaptur-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() =>
    getStoredTheme(storageKey, defaultTheme),
  );
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (!isBrowser()) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Resolve the actual theme (dark or light)
  const resolvedTheme: "dark" | "light" = useMemo(() => {
    if (theme === "system") {
      return systemPrefersDark ? "dark" : "light";
    }
    return theme;
  }, [theme, systemPrefersDark]);

  // Get theme tokens based on resolved theme
  const tokens = useMemo<ThemeTokens>(() => {
    return resolvedTheme === "dark" ? darkTheme : lightTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    // Listen to system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemPrefersDark(e.matches);
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    if (isBrowser()) {
      window.localStorage.setItem(storageKey, newTheme);
    }
    setThemeState(newTheme);
  };

  const value = {
    theme,
    resolvedTheme,
    setTheme,
    tokens,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};


import { useTheme } from "../components/ThemeProvider";
import type { ThemeTokens } from "@shared/config/theme";

/**
 * Hook to access theme tokens
 * Returns the current theme tokens based on the active theme
 */
export const useThemeTokens = (): ThemeTokens => {
  const { tokens } = useTheme();
  return tokens;
};


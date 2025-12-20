/**
 * Theme configuration for light and dark modes
 * Based on Fluent UI design tokens structure
 */

export interface ThemeTokens {
  // Border Radius
  borderRadiusNone: string;
  borderRadiusSmall: string;
  borderRadiusMedium: string;
  borderRadiusLarge: string;
  borderRadiusXLarge: string;
  borderRadiusCircular: string;

  // Font Sizes
  fontSizeBase100: string;
  fontSizeBase200: string;
  fontSizeBase300: string;
  fontSizeBase400: string;
  fontSizeBase500: string;
  fontSizeBase600: string;
  fontSizeHero700: string;
  fontSizeHero800: string;
  fontSizeHero900: string;
  fontSizeHero1000: string;

  // Line Heights
  lineHeightBase100: string;
  lineHeightBase200: string;
  lineHeightBase300: string;
  lineHeightBase400: string;
  lineHeightBase500: string;
  lineHeightBase600: string;
  lineHeightHero700: string;
  lineHeightHero800: string;
  lineHeightHero900: string;
  lineHeightHero1000: string;

  // Font Weights
  fontWeightRegular: number;
  fontWeightMedium: number;
  fontWeightSemibold: number;
  fontWeightBold: number;

  // Colors - Foreground
  colorNeutralForeground1: string;
  colorNeutralForeground2: string;
  colorNeutralForeground3: string;
  colorNeutralForeground4: string;
  colorNeutralForegroundDisabled: string;
  colorNeutralForegroundInverted: string;

  // Colors - Background
  colorNeutralBackground1: string;
  colorNeutralBackground2: string;
  colorNeutralBackground3: string;
  colorNeutralBackground4: string;
  colorNeutralBackground5: string;
  colorNeutralBackground6: string;
  colorNeutralBackgroundDisabled: string;

  // Colors - Stroke/Border
  colorNeutralStroke1: string;
  colorNeutralStroke2: string;
  colorNeutralStroke3: string;
  colorNeutralStrokeSubtle: string;
  colorNeutralStrokeAccessible: string;
  colorNeutralStrokeDisabled: string;

  // Colors - Brand
  colorBrandForeground1: string;
  colorBrandBackground: string;
  colorBrandStroke1: string;

  // Colors - Status
  colorStatusDangerForeground1: string;
  colorStatusDangerBackground1: string;
  colorStatusDangerBorder1: string;
  colorStatusSuccessForeground1: string;
  colorStatusSuccessBackground1: string;
  colorStatusWarningForeground1: string;
  colorStatusWarningBackground1: string;

  // Spacing
  spacingHorizontalS: string;
  spacingHorizontalM: string;
  spacingHorizontalL: string;
  spacingHorizontalXL: string;
  spacingHorizontalXXL: string;
  spacingHorizontalXXXL: string;
  spacingVerticalS: string;
  spacingVerticalM: string;
  spacingVerticalL: string;
  spacingVerticalXL: string;
  spacingVerticalXXL: string;
  spacingVerticalXXXL: string;

  // Shadows
  shadow2: string;
  shadow4: string;
  shadow8: string;
  shadow16: string;
}

// Light theme tokens
export const lightTheme: ThemeTokens = {
  borderRadiusNone: "0",
  borderRadiusSmall: "2px",
  borderRadiusMedium: "4px",
  borderRadiusLarge: "6px",
  borderRadiusXLarge: "8px",
  borderRadiusCircular: "10000px",

  fontSizeBase100: "10px",
  fontSizeBase200: "12px",
  fontSizeBase300: "14px",
  fontSizeBase400: "16px",
  fontSizeBase500: "20px",
  fontSizeBase600: "24px",
  fontSizeHero700: "28px",
  fontSizeHero800: "32px",
  fontSizeHero900: "40px",
  fontSizeHero1000: "68px",

  lineHeightBase100: "14px",
  lineHeightBase200: "16px",
  lineHeightBase300: "20px",
  lineHeightBase400: "22px",
  lineHeightBase500: "28px",
  lineHeightBase600: "32px",
  lineHeightHero700: "36px",
  lineHeightHero800: "40px",
  lineHeightHero900: "52px",
  lineHeightHero1000: "92px",

  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,

  // Light theme colors
  colorNeutralForeground1: "#242424",
  colorNeutralForeground2: "#424242",
  colorNeutralForeground3: "#616161",
  colorNeutralForeground4: "#707070",
  colorNeutralForegroundDisabled: "#bdbdbd",
  colorNeutralForegroundInverted: "#ffffff",

  colorNeutralBackground1: "#ffffff",
  colorNeutralBackground2: "#fafafa",
  colorNeutralBackground3: "#f5f5f5",
  colorNeutralBackground4: "#f0f0f0",
  colorNeutralBackground5: "#ebebeb",
  colorNeutralBackground6: "#e6e6e6",
  colorNeutralBackgroundDisabled: "#f0f0f0",

  colorNeutralStroke1: "#d1d1d1",
  colorNeutralStroke2: "#e0e0e0",
  colorNeutralStroke3: "#f0f0f0",
  colorNeutralStrokeSubtle: "#e0e0e0",
  colorNeutralStrokeAccessible: "#616161",
  colorNeutralStrokeDisabled: "#e0e0e0",

  colorBrandForeground1: "#0f6cbd",
  colorBrandBackground: "#0f6cbd",
  colorBrandStroke1: "#0f6cbd",

  colorStatusDangerForeground1: "#b10e1c",
  colorStatusDangerBackground1: "#fdf3f4",
  colorStatusDangerBorder1: "#eeacb2",
  colorStatusSuccessForeground1: "#0e700e",
  colorStatusSuccessBackground1: "#f1faf1",
  colorStatusWarningForeground1: "#bc4b09",
  colorStatusWarningBackground1: "#fff9f5",

  spacingHorizontalS: "8px",
  spacingHorizontalM: "12px",
  spacingHorizontalL: "16px",
  spacingHorizontalXL: "20px",
  spacingHorizontalXXL: "24px",
  spacingHorizontalXXXL: "32px",
  spacingVerticalS: "8px",
  spacingVerticalM: "12px",
  spacingVerticalL: "16px",
  spacingVerticalXL: "20px",
  spacingVerticalXXL: "24px",
  spacingVerticalXXXL: "32px",

  shadow2: "0 0 2px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)",
  shadow4: "0 0 2px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)",
  shadow8: "0 0 2px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.14)",
  shadow16: "0 0 2px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.14)",
};

// Dark theme tokens
export const darkTheme: ThemeTokens = {
  ...lightTheme, // Inherit all non-color values

  // Dark theme colors
  colorNeutralForeground1: "#ffffff",
  colorNeutralForeground2: "#f3f3f3",
  colorNeutralForeground3: "#d1d1d1",
  colorNeutralForeground4: "#b3b3b3",
  colorNeutralForegroundDisabled: "#6d6d6d",
  colorNeutralForegroundInverted: "#242424",

  colorNeutralBackground1: "#1f1f1f",
  colorNeutralBackground2: "#292929",
  colorNeutralBackground3: "#333333",
  colorNeutralBackground4: "#3d3d3d",
  colorNeutralBackground5: "#474747",
  colorNeutralBackground6: "#525252",
  colorNeutralBackgroundDisabled: "#3d3d3d",

  colorNeutralStroke1: "#4b4b4b",
  colorNeutralStroke2: "#5c5c5c",
  colorNeutralStroke3: "#6d6d6d",
  colorNeutralStrokeSubtle: "#5c5c5c",
  colorNeutralStrokeAccessible: "#b3b3b3",
  colorNeutralStrokeDisabled: "#5c5c5c",

  colorBrandForeground1: "#479ef5",
  colorBrandBackground: "#0f6cbd",
  colorBrandStroke1: "#479ef5",

  colorStatusDangerForeground1: "#dc626d",
  colorStatusDangerBackground1: "#3d1a1d",
  colorStatusDangerBorder1: "#7a4047",
  colorStatusSuccessForeground1: "#54b054",
  colorStatusSuccessBackground1: "#1a3d1a",
  colorStatusWarningForeground1: "#faa06b",
  colorStatusWarningBackground1: "#3d2a1a",

  shadow2: "0 0 2px rgba(0,0,0,0.48), 0 1px 2px rgba(0,0,0,0.40)",
  shadow4: "0 0 2px rgba(0,0,0,0.48), 0 2px 4px rgba(0,0,0,0.40)",
  shadow8: "0 0 2px rgba(0,0,0,0.48), 0 4px 8px rgba(0,0,0,0.40)",
  shadow16: "0 0 2px rgba(0,0,0,0.48), 0 8px 16px rgba(0,0,0,0.40)",
};

export type ThemeMode = 'light' | 'dark';

/**
 * Get theme tokens based on theme mode
 */
export const getThemeTokens = (mode: ThemeMode): ThemeTokens => {
  return mode === 'dark' ? darkTheme : lightTheme;
};


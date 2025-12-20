# Theme Configuration System

This directory contains theme configuration files for light and dark modes.

## Structure

- `lightTheme.ts` - Design tokens for light mode
- `darkTheme.ts` - Design tokens for dark mode
- `index.ts` - Exports theme configurations

## Usage

### Accessing Theme Tokens

```tsx
import { useThemeTokens } from '@/hooks/useThemeTokens';

function MyComponent() {
  const tokens = useThemeTokens();
  
  return (
    <div 
      style={{
        backgroundColor: tokens.colorNeutralBackground1,
        color: tokens.colorNeutralForeground1,
        borderRadius: tokens.borderRadiusLarge,
        fontSize: tokens.fontSizeBase300,
        padding: tokens.spacingHorizontalL,
      }}
    >
      Content
    </div>
  );
}
```

### Accessing Theme State

```tsx
import { useTheme } from '@/components/ThemeProvider';

function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, tokens } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current theme: {resolvedTheme}
    </button>
  );
}
```

## Theme Tokens Available

The theme configuration includes:

- **Border Radius**: `borderRadiusNone`, `borderRadiusSmall`, `borderRadiusMedium`, `borderRadiusLarge`, etc.
- **Font Sizes**: `fontSizeBase100` through `fontSizeHero1000`
- **Line Heights**: `lineHeightBase100` through `lineHeightHero1000`
- **Font Weights**: `fontWeightRegular`, `fontWeightMedium`, `fontWeightSemibold`, `fontWeightBold`
- **Spacing**: `spacingHorizontal*` and `spacingVertical*` tokens
- **Colors**: 
  - Neutral foreground/background colors
  - Brand colors
  - Status colors (success, warning, danger)
  - Stroke/border colors
- **Shadows**: `shadow2`, `shadow4`, `shadow8`, etc.
- **Duration/Curves**: Animation timing and easing curves

## Dynamic Theme Switching

The theme automatically switches based on:
1. The `ThemeProvider` defaultTheme prop
2. User preference stored in localStorage
3. System preference (when theme is set to "system")
4. URL parameter `?theme=dark|light|system`

All colors, spacing, and other design tokens are automatically updated when the theme changes.


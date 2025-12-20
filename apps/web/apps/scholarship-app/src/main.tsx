import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { initializeIcons, loadTheme, createTheme } from '@fluentui/react';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found');
}

// Initialize Fluent UI icons - must be called before rendering
initializeIcons();

// Create Fluent UI theme with proper defaults
const theme = createTheme({
  palette: {
    themePrimary: '#0078d4',
    themeSecondary: '#0e5ca8',
    neutralPrimary: '#323130',
    neutralSecondary: '#605e5c',
    neutralTertiary: '#a19f9d',
    neutralQuaternary: '#c8c6c4',
    neutralLight: '#edebe9',
    neutralLighter: '#f3f2f1',
    neutralLighterAlt: '#faf9f8',
    white: '#ffffff',
    black: '#000000',
  },
  fonts: {
    small: {
      fontSize: '12px',
      fontFamily: "'Inter', sans-serif",
    },
    medium: {
      fontSize: '14px',
      fontFamily: "'Inter', sans-serif",
    },
    large: {
      fontSize: '16px',
      fontFamily: "'Inter', sans-serif",
    },
    xLarge: {
      fontSize: '18px',
      fontFamily: "'Inter', sans-serif",
    },
  },
});

// Load the theme globally
loadTheme(theme);

// Set initial theme class to prevent flash of wrong theme
// ThemeProvider will handle theme management after mount
// Note: storageKey must match the one used in App.tsx ThemeProvider
if (typeof window !== 'undefined') {
  const stored = window.localStorage.getItem('vite-ui-theme');
  const theme = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'light';
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.classList.add(systemTheme);
  } else {
    document.documentElement.classList.add(theme);
  }
}

createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);

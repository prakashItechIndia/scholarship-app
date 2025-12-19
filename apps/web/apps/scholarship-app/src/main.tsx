import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { initializeIcons, loadTheme, createTheme } from '@fluentui/react';
import App from './App';
import './index.css';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found');
}

// Initialize Fluent UI icons
initializeIcons();

// Create Fluent UI theme
const theme = createTheme({
  palette: {
    themePrimary: '#0f6cbd',
    themeSecondary: '#0e5ca8',
  },
});

// Load the theme
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

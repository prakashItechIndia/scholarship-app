import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@shared/lib/react-query-config';

import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeSync } from './components/ThemeSync';
import { Router } from './router/Router';

// Create optimized query client with performance settings
const queryClient = createQueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <div className="font-inter">
          <ThemeSync />
          <AuthProvider>
            <Router />
          </AuthProvider>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

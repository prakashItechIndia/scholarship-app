import { FluentProvider } from '@fluentui/react-components';
import { createQueryClient } from '@shared/lib/react-query-config';
import { QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './contexts/AuthContext';
import { Router } from './router/Router';

// Create optimized query client with performance settings
const queryClient = createQueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <FluentProvider>
        {/* <ThemeProvider defaultTheme="light"> */}
            {/* <ThemeSync /> */}
            <AuthProvider>
              <Router />
            </AuthProvider>
        {/* </ThemeProvider> */}
      </FluentProvider>
    </QueryClientProvider>
  );
};

export default App;

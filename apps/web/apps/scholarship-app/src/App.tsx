import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { createQueryClient } from '@shared/lib/react-query-config';
import { QueryClientProvider } from '@tanstack/react-query';

import { PermissionWrapper } from './components/PermissionWrapper';
import { ToastProvider } from './components/ui/ToastProvider';
import { AuthProvider } from './contexts/AuthContext';
import { Router } from './router/Router';

// Create optimized query client with performance settings
const queryClient = createQueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <FluentProvider theme={webLightTheme}>
        {/* <ThemeProvider defaultTheme="light"> */}
            {/* <ThemeSync /> */}
            <ToastProvider>
              <AuthProvider>
                <PermissionWrapper>
                  <Router />
                </PermissionWrapper>
              </AuthProvider>
            </ToastProvider>
        {/* </ThemeProvider> */}
      </FluentProvider>
    </QueryClientProvider>
  );
};

export default App;

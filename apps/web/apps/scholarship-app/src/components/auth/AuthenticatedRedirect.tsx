import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { handleAuthRedirect } from '../../utils/redirect';
import { LoadingScreen } from '../layout/LoadingScreen';

export const AuthenticatedRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Redirect authenticated users to the experience app
      // handleAuthRedirect will use returnUrl, productCode, or default to experience app
      const searchParams = new URLSearchParams(window.location.search);
      const returnUrl =
        searchParams.get('redirect') ?? searchParams.get('returnUrl');
      const productCode = searchParams.get('product');

      handleAuthRedirect(returnUrl ?? null, productCode ?? null);
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to sign in
    window.location.href = '/user-login';
    return <LoadingScreen message="Redirecting to sign in..." />;
  }

  return <LoadingScreen message="Redirecting to experience app..." />;
};

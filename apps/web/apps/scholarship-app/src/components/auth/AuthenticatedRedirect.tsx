import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { handleAuthRedirect } from '../../utils/redirect';
import { LoadingScreen } from '../layout/LoadingScreen';
import { 
  isScholarshipLoggedIn, 
  getScholarshipUserType, 
  getLandingPage 
} from '../../utils/routeProtection';

/**
 * AuthenticatedRedirect Component
 * 
 * Handles redirects for unmatched routes:
 * - If scholarship user is logged in → redirect to landing page based on userType
 * - If regular auth user is logged in → redirect via handleAuthRedirect
 * - If not logged in → redirect to login page
 */
export const AuthenticatedRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  // Check scholarship auth status
  const scholarshipLoggedIn = isScholarshipLoggedIn();
  const scholarshipUserType = getScholarshipUserType();

  useEffect(() => {
    if (!loading && isAuthenticated && !scholarshipLoggedIn) {
      // Redirect authenticated users (non-scholarship) to the experience app
      // handleAuthRedirect will use returnUrl, productCode, or default to experience app
      const searchParams = new URLSearchParams(window.location.search);
      const returnUrl =
        searchParams.get('redirect') ?? searchParams.get('returnUrl');
      const productCode = searchParams.get('product');

      handleAuthRedirect(returnUrl ?? null, productCode ?? null);
    }
  }, [isAuthenticated, loading, scholarshipLoggedIn]);

  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  // Priority 1: Scholarship users → redirect to landing page based on userType
  if (scholarshipLoggedIn) {
    const landingPage = getLandingPage(scholarshipUserType);
    return <Navigate to={landingPage} replace />;
  }

  // Priority 2: Regular authenticated users → redirect via handleAuthRedirect
  if (isAuthenticated) {
    return <LoadingScreen message="Redirecting..." />;
  }

  // Priority 3: Not authenticated → redirect to login
  return <Navigate to="/user-login" replace />;
};

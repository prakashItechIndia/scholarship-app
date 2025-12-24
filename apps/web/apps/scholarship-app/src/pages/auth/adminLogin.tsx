import { AuthLayoutWrapper } from '@/components/auth/AuthLayoutWrapper';
import { EmailField } from '@/components/auth/EmailField';
import { LogoHeader } from '@/components/auth/LogoHeader';
import { PasswordField } from '@/components/auth/PasswordField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { TermsOfServiceText } from '@/components/auth/TermsOfServiceText';
import { WelcomeText } from '@/components/auth/WelcomeText';
import { useToast } from '@/components/ui/toast';
import { getBaseUrl } from '@/utils/signInUtils';
import { Stack, Text } from '@fluentui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@shared/components';
import { secureTokenStorage } from '@shared/utils/secureTokenStorage';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { SEO } from '../../components/seo/SEO';
import { useAuth } from '../../contexts/AuthContext';
import { handleAuthRedirect } from '../../utils/redirect';
import { generateOrganizationSchema } from '../../utils/schema';
import adminLoginBanner from '@shared/assets/icons/adminLogin.png';

const loginSchema = z.object({
  username: z
    .string()
    .default('')
    .refine((val) => val.trim().length > 0, {
      message: 'Username is required',
    }),
  password: z.string().refine((val) => val.length > 0, {
    message: 'Password is required',
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const AdminSignInPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const redirectUrl = searchParams.get('redirect') ?? searchParams.get('returnUrl');
  const productCode = searchParams.get('product');
  const isLogout = searchParams.get('logout') === 'true';

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit } = loginForm;
  const { success, error } = useToast();

  const baseUrl = getBaseUrl();
  const organizationSchema = generateOrganizationSchema({
    name: 'iCaptur',
    url: baseUrl,
    description: 'Secure single sign-on authentication for iCaptur products',
    contactPoint: {
      contactType: 'Customer Service',
      email: 'support@icaptur.ai',
    },
  });

  // Handle centralized logout
  useEffect(() => {
    if (isLogout) {
      const handleLogout = async () => {
        try {
          const { forceClearAuthStorage } = await import('@shared/utils/secureTokenStorage');
          forceClearAuthStorage();
        } catch {
          secureTokenStorage.clearTokens();
        }

        const themePreference = localStorage.getItem('icaptur-theme');
        localStorage.clear();
        sessionStorage.clear();

        if (themePreference) {
          localStorage.setItem('icaptur-theme', themePreference);
        }

        const { stopTokenRefresh } = await import('@shared/services/centralizedTokenRefresh');
        stopTokenRefresh();

        const newParams = new URLSearchParams(searchParams);
        newParams.delete('logout');
        setSearchParams(newParams, { replace: true });
        await checkAuthStatus();
      };

      void handleLogout();
    }
  }, [isLogout, searchParams, setSearchParams, checkAuthStatus]);

  // Redirect if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (isLogout || !isAuthenticated) return;

      const isValid = await secureTokenStorage.hasValidToken();
      if (isValid) {
        const token = await secureTokenStorage.getAccessToken();
        handleAuthRedirect(redirectUrl ?? null, productCode ?? null, token ?? undefined);
      }
    };
    void checkAuth();
  }, [isAuthenticated, redirectUrl, productCode, isLogout]);


  const onLoginSubmit = async (values: LoginFormData) => {
    try {
      setIsLoading(true);
      
      // Import scholarship auth service
      const { scholarshipAuth } = await import('../../services/scholarship.service');
      
      // Call login API - validates credentials using ValidateUser stored procedure
      // This only works for admin users (not Student role users)
      const loginResponse = await scholarshipAuth.login(values.username, values.password);
      
      // Create session token for admin users
      const responseData = (loginResponse as unknown) as { userId?: number; userName?: string; roleId?: number; [key: string]: unknown };
      const sessionToken = btoa(JSON.stringify({
        username: values.username,
        userId: responseData.userId ?? null,
        userName: responseData.userName ?? values.username,
        roleId: responseData.roleId ?? null,
        timestamp: Date.now(),
        expiresAt: Date.now() + (30 * 60 * 1000), // 30 minutes session timeout per BRD
        isAdmin: true, // Mark as admin user
      }));
      
      // Store session token and user data
      sessionStorage.setItem('scholarship_admin_session_token', sessionToken);
      
      localStorage.setItem('scholarship_auth', JSON.stringify({
        username: values.username,
        timestamp: Date.now(),
        user: loginResponse,
        isAdmin: true, // Mark as admin user
      }));
      
      // Redirect to admin dashboard after successful login
      // Role_Id 1 or 7 → AdminPanelApprove (approve page) - can be handled within dashboard
      // Other roles → AdminPanelHome (home/dashboard)
      const roleId = responseData.roleId ?? 0;
      if (roleId === 1 || roleId === 7) {
        success('Successfully Logged In', 'Redirecting to approval panel...');
        setTimeout(() => void navigate('/admin-dashboard'), 300);
      } else {
        success('Successfully Logged In', 'Redirecting to dashboard...');
        setTimeout(() => void navigate('/admin-dashboard'), 300);
      }
    } catch (err: unknown) {
      // Handle specific error cases per BRD Section 5.4.3
      let errorMessage = 'Invalid credentials. Please try again.';
      if (err instanceof Error) {
        if (err.message.includes('Invalid') || err.message.includes('password') || err.message.includes('credentials')) {
          errorMessage = 'Incorrect username or password. Try again.';
        } else if (err.message.includes('not active') || err.message.includes('Account')) {
          errorMessage = 'Account is not active. Please contact support.';
        } else {
          errorMessage = err.message;
        }
      }
      error('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <SEO
        title="Sign In - Leo Muthu Scholarship"
        description="Log in to administer and monitor scholarship applications. An initiative of ARAM Foundation."
        url="/user-login"
        keywords="Leo Muthu Scholarship, LMS, ARAM Foundation, scholarship application, education support"
        schema={organizationSchema}
      />
      <AuthLayoutWrapper footerVariant="email" bannerImage={adminLoginBanner}>
        <LogoHeader variant="email" />
        
        <WelcomeText 
          variant="email" 
          subtitle="Log In to Administer and Monitor Scholarship Applications"
        />

        <Form {...loginForm}>
          <form onSubmit={(e) => void handleSubmit(onLoginSubmit)(e)} noValidate>
            <Stack tokens={{ childrenGap: 24 }}>
              <EmailField 
                control={loginForm.control} 
                name="username" 
                variant="password" 
                placeholder="Enter your username"
              />
              <Stack tokens={{ childrenGap: 8 }}>
                <PasswordField
                  control={loginForm.control}
                  name="password"
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  variant="password"
                  placeholder="Enter your password"
                  hideprefixIcon={true}
                />
                <Stack horizontal horizontalAlign="end">
                  <Text
                    variant="small"
                    styles={{
                      root: {
                        color: '#2453C3',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif',
                      },
                    }}
                    onClick={() => {
                      // TODO: Navigate to forgot password page
                      console.log('Forgot password clicked');
                    }}
                  >
                    Forgot your password?
                  </Text>
                </Stack>
              </Stack>
              <Stack tokens={{ childrenGap: 8 }}>
                <SubmitButton
                  type="submit"
                  disabled={loginForm.formState.isSubmitting || isLoading}
                  isLoading={loginForm.formState.isSubmitting || isLoading}
                  loadingText="Loading..."
                  variant="password"
                  className="h-11"
                >
                  Log In
                </SubmitButton>

                <TermsOfServiceText />
              </Stack>
            </Stack>
          </form>
        </Form>
      </AuthLayoutWrapper>
    </>
  );
};

export default AdminSignInPage;

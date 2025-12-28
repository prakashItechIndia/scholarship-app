import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Stack, MessageBar, MessageBarType } from '@fluentui/react';
import { secureTokenStorage } from '@shared/utils/secureTokenStorage';
import { preserveQueryParams, handleAuthRedirect } from '../../utils/redirect';
import { useAuth } from '../../contexts/AuthContext';
import { isScholarshipLoggedIn } from '../../utils/routeProtection';
import { SEO } from '../../components/seo/SEO';
import { generateOrganizationSchema } from '../../utils/schema';
import { Form } from '@shared/components';
import { useToast } from '@/components/ui/toast';
import { SocialLoginButton } from '@/components/auth/SocialLoginButton';
import { AuthLayoutWrapper } from '@/components/auth/AuthLayoutWrapper';
import { LogoHeader } from '@/components/auth/LogoHeader';
import { EmailField } from '@/components/auth/EmailField';
import { PasswordField } from '@/components/auth/PasswordField';
import { WelcomeText } from '@/components/auth/WelcomeText';
import { TermsOfServiceText } from '@/components/auth/TermsOfServiceText';
import { DividerWithText } from '@/components/auth/DividerWithText';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { getBaseUrl } from '@/utils/signInUtils';
import { socialLogin, type SocialProvider } from '../../services/socialLogin.service';

const emailSchema = z.object({
  email: z
    .string()
    .default('')
    .refine((val) => val.trim().length > 0, {
      message: 'Email address is required',
    })
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: 'Provide a valid email address',
    }),
});

const passwordSchema = z.object({
  email: z
    .string()
    .default('')
    .refine((val) => val.trim().length > 0, {
      message: 'Email address is required',
    })
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: 'Provide a valid email address',
    }),
  password: z
    .string()
    .default('')
    .refine((val) => val.length > 0, {
      message: 'Password is required',
    }),
  cardcode: z.string().optional(),
  rememberMe: z.boolean().optional(),
});

type EmailFormData = z.infer<typeof emailSchema>;
type SignInFormData = z.infer<typeof passwordSchema>;

const SignInPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const redirectUrl = searchParams.get('redirect') ?? searchParams.get('returnUrl');
  const productCode = searchParams.get('product');
  const passwordCreated = searchParams.get('passwordCreated') === 'true';
  const isLogout = searchParams.get('logout') === 'true';

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema)
  });

  const passwordForm = useForm<SignInFormData>({
    resolver: zodResolver(passwordSchema) as any,
    defaultValues: { rememberMe: true },
  });

  const { handleSubmit: handleEmailSubmit } = emailForm;
  const { handleSubmit: handlePasswordSubmit, setValue: setPasswordValue } = passwordForm;
  const { success, error } = useToast();

  // Handle social login
  const handleSocialLogin = (provider: SocialProvider) => {
    try {
      socialLogin.initiate(provider);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Failed to initiate ${provider} login. Please check your configuration.`;
      error('Social Login Error', errorMessage);
    }
  };

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

  // Redirect if already authenticated (check both AuthContext and scholarship auth)
  useEffect(() => {
    const checkAuth = async () => {
      if (isLogout) return;

      // Check scholarship auth first (for student/admin users)
      const scholarshipLoggedIn = isScholarshipLoggedIn();
      if (scholarshipLoggedIn) {
        // Redirect to user dashboard or registration based on status
        const authData = localStorage.getItem('scholarship_auth');
        if (authData) {
          try {
            const parsed = JSON.parse(authData);
            // Check if user has completed registration
            if (parsed?.user?.userId) {
              void navigate('/user-dashboard');
              return;
            }
          } catch {
            // Invalid auth data
          }
        }
      }

      // Check AuthContext (for other auth methods)
      if (isAuthenticated) {
        const isValid = await secureTokenStorage.hasValidToken();
        if (isValid) {
          const token = await secureTokenStorage.getAccessToken();
          handleAuthRedirect(redirectUrl ?? null, productCode ?? null, token ?? undefined);
        }
      }
    };
    void checkAuth();
  }, [isAuthenticated, redirectUrl, productCode, isLogout, navigate]);


  const verifyEmail = (email: string, mode: 'login' | 'check') => {
    if (!email?.includes('@')) {
      error('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setPasswordValue('email', email);

    if (mode === 'login') {
      setStep('password');
    } else {
      // Store email in localStorage and redirect to verification page
      localStorage.setItem('verification_email', email);
      void navigate('/registration');
    }
  };

  const onEmailSubmit = async (values: EmailFormData) => {
    try {
      setIsLoading(true);

      // Check user login status (email exists AND password set)
      const { scholarshipApplication } = await import('../../services/scholarship.service');
      const loginStatus = await scholarshipApplication.checkUserLoginStatus(values.email);

      if (loginStatus.canLogin) {
        // Email exists AND password is set - enable password field for login
        verifyEmail(values.email, 'login');
      } else if (loginStatus.needsOnboarding) {
        // Email exists but password not set - redirect to onboarding
        localStorage.setItem('verification_email', values.email);

        // Send verification email automatically
        try {
          await scholarshipApplication.sendVerificationEmail(values.email);
        } catch (err: unknown) {
          // Log error but continue to verification page
          console.error('Failed to send verification email:', err);
        }

        void navigate('/email-verification');
      } else {
        // Email does not exist - send verification email and redirect to email verification/onboarding
        localStorage.setItem('verification_email', values.email);

        // Send verification email automatically
        try {
          await scholarshipApplication.sendVerificationEmail(values.email);
        } catch (err: unknown) {
          // Log error but continue to verification page
          console.error('Failed to send verification email:', err);
        }

        void navigate('/email-verification');
      }
    } catch (err: unknown) {
      // BRD Section 5.4.3: Error handling for email check
      let errorMessage = 'Failed to verify email. Please try again.';
      if (err instanceof Error) {
        if (err.message.includes('not found') || err.message.includes('Email')) {
          errorMessage = 'Email not registered. Please check or sign up.';
        } else {
          errorMessage = err.message;
        }
      }
      error('Verification Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (values: SignInFormData) => {
    try {
      setIsLoading(true);

      // Import scholarship auth service
      const { scholarshipAuth, scholarshipApplication } = await import('../../services/scholarship.service');

      // Call user login API - validates credentials (allows Student users)
      const loginResponse = await scholarshipAuth.userLogin(values.email, values.password);

      // Create session token (simple implementation - in production use JWT or secure session)
      const responseData = (loginResponse as unknown) as { userId?: number; userName?: string;[key: string]: unknown };
      const sessionToken = btoa(JSON.stringify({
        email: values.email,
        userId: responseData.userId ?? null,
        userName: responseData.userName ?? values.email,
        timestamp: Date.now(),
        expiresAt: Date.now() + (20 * 60 * 1000), // 20 minutes session timeout per BRD
      }));

      // Store session token and user data
      if (values.rememberMe) {
        localStorage.setItem('scholarship_session_token', sessionToken);
      } else {
        sessionStorage.setItem('scholarship_session_token', sessionToken);
      }

      localStorage.setItem('scholarship_auth', JSON.stringify({
        email: values.email,
        cardcode: values.cardcode,
        rememberMe: values.rememberMe,
        timestamp: Date.now(),
        user: loginResponse,
      }));

      // Check if user has completed registration (has record in t_Registration)
      // New users (who just set password) should be redirected to registration form
      // Existing users (who have completed registration) should be redirected to dashboard
      const hasCompletedRegistration = await scholarshipApplication.checkEmailExists(values.email);

      if (hasCompletedRegistration) {
        // Existing user - has completed registration, redirect to dashboard
        success('Sign In Successful', 'Redirecting to dashboard...');
        setTimeout(() => void navigate('/user-dashboard'), 300);
      } else {
        // New user - just set password, hasn't completed registration, redirect to registration form
        success('Sign In Successful', 'Please complete your registration...');
        setTimeout(() => void navigate('/registration'), 300);
      }
    } catch (err: unknown) {
      // BRD Section 5.4.3: Login Validations and Error Handling
      // BRD Section 5.5: Failed Attempt Limit (5 attempts) and Lockout Duration (15 minutes)
      let errorMessage = 'Invalid credentials. Please try again.';
      if (err instanceof Error) {
        // Check for account lockout (BRD Section 5.4.2, Step 4b)
        if (err.message.includes('locked') || err.message.includes('Lockout') || err.message.includes('temporarily locked')) {
          errorMessage = 'Account temporarily locked. Please try again in 15 minutes.'; // BRD Section 5.4.2, Step 4b
        } else if (err.message.includes('Invalid') || err.message.includes('password') || err.message.includes('credentials')) {
          errorMessage = 'Incorrect password. Try again.'; // BRD Section 5.4.3: "Invalid password" -> "Incorrect password. Try again."
        } else if (err.message.includes('not active') || err.message.includes('Account')) {
          errorMessage = 'Account is not active. Please contact support.';
        } else if (err.message.includes('not found') || err.message.includes('Email')) {
          errorMessage = 'Email not registered. Please check or sign up.'; // BRD Section 5.4.3: "Invalid email" -> "Email not registered. Please check or sign up."
        } else if (err.message.includes('not verified') || err.message.includes('verify')) {
          errorMessage = 'Please verify your email before logging in.'; // BRD Section 5.4.2, Step 4a
        } else {
          errorMessage = err.message;
        }
      }
      error('Sign In Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };



  if (step === 'email') {
    return (
      <>
        <SEO
          title="Sign In - Leo Muthu Scholarship"
          description="Apply online for the Leo Muthu Scholarship and secure your educational support. An initiative of ARAM Foundation."
          url="/user-login"
          keywords="Leo Muthu Scholarship, LMS, ARAM Foundation, scholarship application, education support"
          schema={organizationSchema}
        />
        <AuthLayoutWrapper footerVariant="email">
          <LogoHeader variant="email" />

          <WelcomeText variant="email" />

          {passwordCreated && (
            <MessageBar messageBarType={MessageBarType.success}>
              Password created successfully! Please sign in with your credentials.
            </MessageBar>
          )}

          <Form {...emailForm}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {/* @ts-ignore - Type inference issue with handleSubmit */}
            <form onSubmit={(e) => void handleEmailSubmit(onEmailSubmit as any)(e)} noValidate>
              <Stack tokens={{ childrenGap: 24 }} >
                <EmailField control={emailForm.control} name="email" variant="email" />

                <Stack tokens={{ childrenGap: 8 }}>
                  <SubmitButton
                    type="submit"
                    disabled={emailForm.formState.isSubmitting || isLoading}
                    isLoading={emailForm.formState.isSubmitting || isLoading}
                    loadingText="Loading..."
                  >
                    Continue
                  </SubmitButton>

                  <TermsOfServiceText />
                </Stack>
              </Stack>
            </form>
          </Form>

          {/* Social Login Section */}
          <Stack tokens={{ childrenGap: 16 }}>
            <DividerWithText />

            <Stack horizontal tokens={{ childrenGap: 12 }} >
              <SocialLoginButton provider="microsoft" onClick={() => handleSocialLogin('microsoft')} />
              <SocialLoginButton provider="google" onClick={() => handleSocialLogin('google')} />
              <SocialLoginButton provider="apple" onClick={() => handleSocialLogin('apple')} />
            </Stack>
          </Stack>
        </AuthLayoutWrapper>
      </>
    );
  }

  // Step 2: Password input
  return (
    <>
      <SEO
        title="Sign In - Leo Muthu Scholarship"
        description="Apply online for the Leo Muthu Scholarship and secure your educational support. An initiative of ARAM Foundation."
        url="/user-login"
        keywords="Leo Muthu Scholarship, LMS, ARAM Foundation, scholarship application, education support"
        schema={organizationSchema}
      />
      <AuthLayoutWrapper footerVariant="email">
        <LogoHeader variant="email" />

        <WelcomeText variant="email" />

        <Form {...passwordForm}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {/* @ts-ignore - Type inference issue with handleSubmit */}
          <form onSubmit={(e) => void handlePasswordSubmit(onPasswordSubmit as any)(e)} noValidate>
            <Stack tokens={{ childrenGap: 24 }}>
              <EmailField control={passwordForm.control} name="email" variant="email" />

              <PasswordField
                control={passwordForm.control}
                name="password"
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                variant="email"
              />

              <Stack tokens={{ childrenGap: 8 }}>
                <Link
                  to={preserveQueryParams('/forgot-password', ['returnUrl', 'product', 'state'])}
                  className="text-[#2453C3] text-xs font-sans leading-4 no-underline hover:underline"
                >
                  Forgot your password?
                </Link>
              </Stack>

              <Stack tokens={{ childrenGap: 8 }}>
                <SubmitButton
                  type="submit"
                  disabled={passwordForm.formState.isSubmitting || isLoading}
                  isLoading={passwordForm.formState.isSubmitting || isLoading}
                  loadingText="Loading..."
                >
                  Log In
                </SubmitButton>

                <TermsOfServiceText />
              </Stack>
            </Stack>
          </form>
        </Form>

        {/* Social Login Section */}
        <Stack tokens={{ childrenGap: 16 }}>
          <DividerWithText />

          <Stack horizontal tokens={{ childrenGap: 12 }}>
            <SocialLoginButton provider="microsoft" onClick={() => handleSocialLogin('microsoft')} />
            <SocialLoginButton provider="google" onClick={() => handleSocialLogin('google')} />
            <SocialLoginButton provider="apple" onClick={() => handleSocialLogin('apple')} />
          </Stack>
        </Stack>
      </AuthLayoutWrapper>
    </>
  );
};

export default SignInPage;

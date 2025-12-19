import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { secureTokenStorage } from '@shared/utils/secureTokenStorage';
import { preserveQueryParams, handleAuthRedirect } from '../../utils/redirect';
import { useAuth } from '../../contexts/AuthContext';
// Removed API hooks - using frontend-only authentication
import { SEO } from '../../components/seo/SEO';
import { generateOrganizationSchema } from '../../utils/schema';
import { Input } from '@/components/ui/input';
import { KeyIcon, PersonIcon, EyeIcon, EyeOffIcon } from '@/components/ui/icons';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { PrimaryButton } from '@fluentui/react';
import { useToast } from '@/components/ui/toast';


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
  const [step, setStep] = useState<'email' | 'password' | 'check-email'>(
    'email',
  );
  const [enteredEmail, setEnteredEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Support both 'redirect' and 'returnUrl' for backward compatibility
  const redirectUrl =
    searchParams.get('redirect') ?? searchParams.get('returnUrl');
  const productCode = searchParams.get('product');
  const passwordCreated = searchParams.get('passwordCreated') === 'true';
  const isLogout = searchParams.get('logout') === 'true';

  // Handle centralized logout - clear tokens when logout parameter is present
  useEffect(() => {
    if (isLogout) {
      // Clear tokens locally without calling logout() again (which would cause redirect loop)
      // The centralizedLogout() already redirected us here, so we just need to clean up local state
      const handleLogout = async () => {
        try {
          const { forceClearAuthStorage } = await import('@shared/utils/secureTokenStorage');
          forceClearAuthStorage();
        } catch {
          secureTokenStorage.clearTokens();
        }
        
        // Preserve theme preference before clearing storage
        const themePreference = localStorage.getItem('icaptur-theme');
        
        // Clear ALL storage (including encrypted tokens)
        localStorage.clear();
        sessionStorage.clear();
        
        // Restore theme preference after clearing storage (theme is global and should persist)
        if (themePreference) {
          localStorage.setItem('icaptur-theme', themePreference);
        }
        
        // Stop any token refresh intervals
        const { stopTokenRefresh } = await import('@shared/services/centralizedTokenRefresh');
        stopTokenRefresh();
        
        // Remove logout parameter from URL but keep product code
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('logout');
        // Keep product code for display purposes, but don't auto-redirect
        setSearchParams(newParams, { replace: true });
        
        // Force auth context to update (clear auth state)
        await checkAuthStatus();
      };
      
      void handleLogout();
    }
  }, [isLogout, searchParams, setSearchParams, checkAuthStatus]);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const passwordForm = useForm<SignInFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { rememberMe: true },
  });

  const {
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = emailForm;

  const {
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    setValue: setPasswordValue,
  } = passwordForm;

  // Redirect if already authenticated (but skip if logout just happened)
  useEffect(() => {
    const checkAuth = async () => {
      // Don't auto-redirect if logout parameter was present (user just logged out)
      if (isLogout) {
        return;
      }

      if (isAuthenticated) {
        const isValid = await secureTokenStorage.hasValidToken();
        if (isValid) {
          const token = await secureTokenStorage.getAccessToken();
          handleAuthRedirect(
            redirectUrl ?? null,
            productCode ?? null,
            token ?? undefined,
          );
        }
      }
    };
    void checkAuth();
  }, [isAuthenticated, redirectUrl, productCode, isLogout]);

  // Auto-check email when productCode is in params (for OAuth flow)
  // Note: This will be triggered when user submits email, not automatically
  // The check happens in verifyEmail which is called on form submit

  const { success, error } = useToast();

  // Frontend-only email verification - no API calls
  const verifyEmail = (email: string, mode: 'login' | 'check') => {
    // Simple email validation
    if (!email?.includes('@')) {
      error('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Accept any valid email format - no API call
    setEnteredEmail(email);
    setPasswordValue('email', email);
    if (mode === 'login') {
      setStep('password');
    } else {
      setStep('check-email');
    }
  };

  const onEmailSubmit = (values: EmailFormData) => {
    verifyEmail(values.email, 'login');
  };

  const onPasswordSubmit = (values: SignInFormData) => {
    // Frontend-only authentication - no API calls
    // Accept any email and password combination
    
    // Store auth data in localStorage
    localStorage.setItem('scholarship_auth', JSON.stringify({
      email: values.email,
      password: values.password, // Note: In production, never store passwords
      cardcode: values.cardcode,
      rememberMe: values.rememberMe,
      timestamp: Date.now(),
    }));

    // Show success message
    success('Sign In Successful', 'Redirecting to registration form...');

    // Redirect to registration form
    setTimeout(() => {
      void navigate('/registration');
    }, 300);
  };

  const handleBackToEmail = () => {
    setStep('email');
  };

  const handleResendActivation = () => {
    // Frontend-only resend - no API call
    if (enteredEmail && resendCooldown === 0) {
      success(
        'Success',
        'Activation email sent successfully. Please check your inbox.',
      );
      setResendCooldown(60); // 60 second cooldown
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const maskedEmail = enteredEmail.replace(
    /(.{2})(.*)(@.*)/,
    (_: string, start: string, middle: string, end: string) => {
      const middleLength = typeof middle === 'string' ? middle.length : 0;
      return `${start}${'*'.repeat(Math.min(middleLength, 5))}${end}`;
    },
  );

  // Helper function to generate subtitle - always show "Sign-in to access iCaptur"
  const getSubtitle = () => {
    return (
      <>
        <span className="text-Neutral-Foreground-4-Rest text-xs font-normal font-inter leading-5">
          Sign-in to access{' '}
        </span>
        <span className="text-Neutral-Foreground-3-Rest text-xs font-semibold font-inter leading-5">
          iCaptur
        </span>
      </>
    );
  };

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://scholarship.icaptur.ai';

  const organizationSchema = generateOrganizationSchema({
    name: 'iCaptur',
    url: baseUrl,
    description:
      'Secure single sign-on authentication for iCaptur products',
    contactPoint: {
      contactType: 'Customer Service',
      email: 'support@icaptur.ai',
    },
  });

  if (step === 'check-email') {
    return (
      <>
        <SEO
          title="Check Your Email"
          description="We've sent an activation link to your email address. Please check your inbox to activate your iCaptur account."
          url="/signin"
          noindex={true}
          schema={organizationSchema}
        />
        <AuthWrapper
          title="Check your email"
          subtitle="We've sent an activation link to your email address."
        >
          <div className="space-y-6">
            <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700 border border-blue-200">
              <strong>{maskedEmail}</strong>
            </div>
            <p className="text-sm text-Neutral-Foreground-2-Rest">
              Please check your inbox and click the activation link to activate
              your account.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleResendActivation}
                disabled={resendCooldown > 0}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Didn't receive email? Resend"}
              </button>

              <button
                onClick={() => setStep('email')}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-Neutral-Foreground-2-Rest transition hover:bg-gray-50"
              >
                Back to Sign-in
              </button>
            </div>
          </div>
        </AuthWrapper>
      </>
    );
  }

  // Step 1: Email input
  if (step === 'email') {
    return (
      <>
        <SEO
          title="Sign In - Leo Muthu Scholarship"
          description="Apply online for the Leo Muthu Scholarship and secure your educational support. An initiative of ARAM Foundation."
          url="/signin"
          keywords="Leo Muthu Scholarship, LMS, ARAM Foundation, scholarship application, education support"
          schema={organizationSchema}
        />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex">
        {/* Left Panel - Memorial Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 items-center justify-center p-12">
          <div className="max-w-lg w-full bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-white/50">
            <div className="text-center space-y-5">
              <h2 className="text-xl font-bold text-gray-800 leading-tight">
                In Fond Remembrance of Our Guiding Star
              </h2>
              <h3 className="text-2xl font-bold text-gray-900">
                Shri. MJF. Ln.Leo Muthu
              </h3>
              <p className="text-sm text-gray-600 italic font-medium">
                A Visionary philanthropist and educationist.
              </p>
              <p className="text-xs text-gray-500 font-medium">
                02-04-1952 - 10-07-2015
              </p>
              
              {/* Portrait Placeholder - Replace with actual image */}
              <div className="my-8 flex justify-center">
                <div className="w-56 h-56 rounded-full bg-gradient-to-br from-blue-300 to-cyan-300 flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden">
                  <PersonIcon className="w-40 h-40 text-white opacity-90" />
                </div>
              </div>
              
              {/* Tamil Text */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-lg text-gray-800 leading-relaxed" style={{ fontFamily: 'serif, Georgia, Times New Roman' }}>
                  ஊக்கமும்- ஆக்கமும் எப்போதும் தேவை!
                </p>
                <p className="text-sm text-gray-600 mt-3 italic" style={{ fontFamily: 'serif, Georgia, Times New Roman' }}>
                  அன்புடன். லியோ முத்து
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Sign In Form */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex-1 flex flex-col px-6 py-8 sm:px-8 lg:px-12 xl:px-16">
            {/* Header with Logo */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                  <PersonIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800">
                    Shri. Leo Muthu Scholarship (LMS)
                  </h1>
                  <p className="text-xs text-gray-600">
                    An Initiative of ARAM Foundation
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-md space-y-6">
                {/* Welcome Message */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome to Leo Muthu Scholarship
                  </h2>
                  <p className="text-sm text-gray-600">
                    Apply Online and Secure Your Educational Support
                  </p>
                </div>

                {passwordCreated && (
                  <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 border border-green-200">
                    Password created successfully! Please sign in with your credentials.
                  </div>
                )}

                <Form {...emailForm}>
                  <form
                    className="flex flex-col gap-6"
                    onSubmit={(e) => {
                      void handleEmailSubmit(onEmailSubmit)(e);
                    }}
                    noValidate
                  >
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                              <span>Email</span>
                              <span className="text-red-500">*</span>
                            </label>
                            <FormControl>
                              <Input
                                autoComplete="off"
                                {...field}
                                value={field.value ?? ''}
                                prefixIcon={
                                  <PersonIcon className="w-5 h-5 text-gray-400" />
                                }
                                type="email"
                                placeholder="Enter your email address"
                                aria-invalid={Boolean(emailErrors.email)}
                                className="bg-white"
                                required={false}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </div>
                        </FormItem>
                      )}
                    />

                <PrimaryButton
                  type="submit"
                  disabled={emailForm.formState.isSubmitting}
                  className="w-full h-11 text-base font-semibold"
                >
                  Continue
                </PrimaryButton>

                    <p className="text-xs text-gray-600 text-center">
                      By continuing, you agree to our{' '}
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </form>
                </Form>

                {/* Social Login Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-sm text-gray-500">OR Continue with</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Microsoft Button */}
                    <button
                      type="button"
                      className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 23 23" fill="none">
                        <rect x="0" y="0" width="10" height="10" fill="#F25022" />
                        <rect x="13" y="0" width="10" height="10" fill="#7FBA00" />
                        <rect x="0" y="13" width="10" height="10" fill="#00A4EF" />
                        <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
                      </svg>
                      <span className="text-xs font-medium text-gray-700">Microsoft</span>
                    </button>

                    {/* Google Button */}
                    <button
                      type="button"
                      className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="text-xs font-medium text-gray-700">Google</span>
                    </button>

                    {/* Apple Button */}
                    <button
                      type="button"
                      className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                      <span className="text-xs font-medium text-gray-700">Apple</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-6 sm:px-8 lg:px-12 xl:px-16">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
              <div>
                Copyright © 2025 LEO MUTHU Scholarship
              </div>
              <div className="flex items-center gap-2">
                <span>Powered by</span>
                <span className="font-semibold text-gray-800">iTech</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  // Step 2: Password input
  return (
    <>
      <SEO
        title="Sign In"
        description="Sign in to your iCaptur account to access your products, manage subscriptions, and more. Secure authentication powered by SSO."
        url="/signin"
        keywords="iCaptur, sign in, login, authentication, SSO, single sign-on"
        schema={organizationSchema}
      />
      <AuthWrapper title="Welcome to iCaptur.ai" subtitle={getSubtitle()}>
        <div className="flex flex-col gap-[24px]">
          <Form {...passwordForm}>
            <form
              className="flex flex-col gap-[16px]"
              onSubmit={(e) => {
                void handlePasswordSubmit(onPasswordSubmit)(e);
              }}
              noValidate
            >
              {/* Email field - read-only with checkmark */}
              <div className="flex flex-col gap-[4px]">
                <label className="text-Neutral-Foreground-1-Rest text-xs font-normal font-inter leading-4 flex items-end gap-[4px]">
                  <span>Username</span>
                  <span className="text-Status-Danger-Foreground-1-Rest text-xs font-normal font-inter leading-4">*</span>
                </label>
                <Input
                  value={enteredEmail || ''}
                  prefixIcon={<PersonIcon />}
                  suffixIcon={
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 8L6 12L14 4"
                        stroke="#107C10"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                  type="email"
                  disabled
                  className="bg-Neutral-Background-3-Rest text-Neutral-Foreground-1-Rest text-xs font-normal font-inter leading-5"
                />
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="text-Neutral-Foreground-2-Link-Rest text-xs font-medium font-inter underline leading-5 text-left w-fit"
                >
                  Change email
                </button>
              </div>
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        prefixIcon={<KeyIcon />}
                        suffixIcon={
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-Neutral-Foreground-2-Rest hover:text-Neutral-Foreground-1-Rest flex items-center justify-center"
                            tabIndex={-1}
                            aria-label={
                              showPassword ? 'Hide password' : 'Show password'
                            }
                          >
                            {showPassword ? (
                              <EyeIcon className="w-4 h-4" />

                            ) : (
                              <EyeOffIcon className="w-4 h-4" />

                            )}
                          </button>
                        }
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password@123"
                        aria-invalid={Boolean(passwordErrors.password)}
                        className="bg-white text-Neutral-Foreground-1-Rest text-xs font-normal font-inter leading-5"
                        required={false}
                      />
                    </FormControl>
                    <FormMessage className="text-Status-Danger-Foreground-1-Rest text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="cardcode"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-[4px]">
                      <label className="text-Neutral-Foreground-1-Rest text-xs font-normal font-inter leading-4 flex items-end gap-[4px]">
                        <span>Card Code (Optional)</span>
                      </label>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          prefixIcon={<PersonIcon />}
                          type="text"
                          placeholder="Enter card code"
                          className="bg-white text-Neutral-Foreground-1-Rest text-xs font-normal font-inter leading-5"
                          required={false}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          id="rememberMe"
                          checked={field.value ?? false}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                        />
                      </FormControl>
                      <label
                        htmlFor="rememberMe"
                        className="text-sm text-Neutral-Foreground-2-Rest cursor-pointer select-none"
                      >
                        Remember me on this device
                      </label>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-[8px]">
                <PrimaryButton
                  type="submit"
                  className="w-full rounded-[4px] bg-[#0f6cbd] px-3 py-[6px] text-Neutral-Foreground-On-Brand-Rest text-xs font-semibold font-inter leading-5 transition hover:bg-[#0e5ca8] disabled:cursor-not-allowed disabled:bg-blue-400"
                  disabled={passwordForm.formState.isSubmitting}
                >
                  {passwordForm.formState.isSubmitting ? 'Signing in…' : 'Sign In'}
                </PrimaryButton>
                <p className="text-Neutral-Foreground-4-Rest text-[10px] font-normal font-inter leading-4">
                  <span>By continuing, you agree to our </span>
                  <a
                    href="#"
                    className="text-Neutral-Foreground-2-Link-Rest text-[10px] font-medium font-inter underline leading-4"
                  >
                    Terms of Service
                  </a>
                  <span className="text-Neutral-Foreground-4-Rest text-[10px] font-normal font-inter leading-4"> </span>
                  <span className="text-Neutral-Foreground-4-Rest text-[10px] font-normal font-inter leading-4">and </span>
                  <a
                    href="#"
                    className="text-Neutral-Foreground-2-Link-Rest text-[10px] font-medium font-inter underline leading-4"
                  >
                    Privacy Policy
                  </a>
                  <span className="text-Neutral-Foreground-4-Rest text-[10px] font-normal font-inter leading-4">.</span>
                </p>
              </div>
            </form>
          </Form>

          <div className="flex flex-col gap-2">
            <p className="text-Neutral-Foreground-4-Rest text-xs font-normal font-inter leading-5">
              <span>Forgot your password? </span>
              <Link
                to={preserveQueryParams('/forgot-password', [
                  'returnUrl',
                  'product',
                  'state',
                ])}
                className="text-Neutral-Foreground-2-Link-Rest text-xs font-medium font-inter underline leading-5"
              >
                Send me a reset link.
              </Link>
            </p>
          </div>
        </div>
      </AuthWrapper>
    </>
  );
};

export default SignInPage;

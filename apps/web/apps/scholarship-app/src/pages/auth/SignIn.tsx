import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Stack, Text, MessageBar, MessageBarType } from '@fluentui/react';
import { secureTokenStorage } from '@shared/utils/secureTokenStorage';
import { preserveQueryParams, handleAuthRedirect } from '../../utils/redirect';
import { useAuth } from '../../contexts/AuthContext';
import { SEO } from '../../components/seo/SEO';
import { generateOrganizationSchema } from '../../utils/schema';
import { Form } from '@shared/components';
import { useToast } from '@/components/ui/toast';
import { SocialLoginButton } from '@/components/auth/SocialLoginButton';
import { AuthLayoutWrapper } from '@/components/auth/AuthLayoutWrapper';
import { ScholarshipFooter } from '@/components/auth/ScholarshipFooter';
import { LogoHeader } from '@/components/auth/LogoHeader';
import { EmailField } from '@/components/auth/EmailField';
import { PasswordField } from '@/components/auth/PasswordField';
import { WelcomeText } from '@/components/auth/WelcomeText';
import { TermsOfServiceText } from '@/components/auth/TermsOfServiceText';
import { DividerWithText } from '@/components/auth/DividerWithText';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { getBaseUrl } from '@/utils/signInUtils';
import { PersonIcon } from '@/components/ui/icons';

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

  const redirectUrl = searchParams.get('redirect') ?? searchParams.get('returnUrl');
  const productCode = searchParams.get('product');
  const passwordCreated = searchParams.get('passwordCreated') === 'true';
  const isLogout = searchParams.get('logout') === 'true';

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const passwordForm = useForm<SignInFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { rememberMe: true },
  });

  const { handleSubmit: handleEmailSubmit } = emailForm;
  const { handleSubmit: handlePasswordSubmit, setValue: setPasswordValue } = passwordForm;
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
    // For now, always redirect to verification for new users
    // TODO: Add API call to check if user exists, then decide between 'login' and 'check'
    // Simulate loading for a few seconds before navigation
    await new Promise(resolve => setTimeout(resolve, 2000));
    verifyEmail(values.email, 'check');
  };

  const onPasswordSubmit = async (values: SignInFormData) => {
    localStorage.setItem('scholarship_auth', JSON.stringify({
      email: values.email,
      password: values.password,
      cardcode: values.cardcode,
      rememberMe: values.rememberMe,
      timestamp: Date.now(),
    }));

    // Show loading for a few seconds before showing success and navigating
    await new Promise(resolve => setTimeout(resolve, 2000));
    success('Sign In Successful', 'Redirecting to registration form...');
    setTimeout(() => void navigate('/registration'), 300);
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
            <form onSubmit={(e) => void handleEmailSubmit(onEmailSubmit)(e)} noValidate>
              <Stack tokens={{ childrenGap: 24 }} >
                <EmailField control={emailForm.control} name="email" variant="email" />

                <Stack tokens={{ childrenGap: 8 }}>
                  <SubmitButton
                  
                    type="submit"
                    disabled={emailForm.formState.isSubmitting}
                    isLoading={emailForm.formState.isSubmitting}
                    loadingText="Loading..."
                    // className='text-white'
                    // className='!bg-[#2453C3]'
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
              <SocialLoginButton provider="microsoft" />
              <SocialLoginButton provider="google" />
              <SocialLoginButton provider="apple" />
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
        description="Log in to administer and monitor scholarship applications. An initiative of ARAM Foundation."
        url="/user-login"
        keywords="Leo Muthu Scholarship, LMS, ARAM Foundation, admin login"
        schema={organizationSchema}
      />
      <Stack
        horizontal
        className="min-h-screen bg-[#0078D4]"
      >
        {/* Left Panel - Login Image */}
        <Stack
          className="hidden lg:flex w-[472px] relative overflow-hidden"
        >
          <Stack
            className="w-full h-full relative rounded-[40px] border-4 border-white m-5"
            style={{
              background: 'linear-gradient(180deg, rgba(10, 224, 231, 0.15) 22.66%, rgba(0, 0, 0, 0) 43.38%)'
            }}
          >
            <Stack horizontalAlign="center" verticalAlign="center" className="w-full h-full">
              <Stack horizontalAlign="center" tokens={{ childrenGap: 16 }} className="text-white text-center p-8">
                <PersonIcon className="w-32 h-32 mx-auto mb-4 opacity-50" />
                <Text variant="large" className="font-semibold">
                  Login Image
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {/* Right Panel - Login Card */}
        <Stack
          grow
          className="bg-white rounded-tl-[20px] rounded-bl-[20px] shadow-[0px_0px_0px_0px_rgba(0,0,0,0.01),2px_2px_6px_0px_rgba(0,0,0,0.01),7px_9px_11px_0px_rgba(0,0,0,0.01),16px_20px_15px_0px_rgba(0,0,0,0.01),28px_36px_18px_0px_rgba(0,0,0,0),44px_56px_20px_0px_rgba(0,0,0,0)]"
        >
          <Stack
            grow
            horizontalAlign="center"
            className="p-8 sm:p-12 lg:p-16 xl:p-24"
          >
            <LogoHeader variant="password" />

            <WelcomeText variant="password" />

            <Stack className="w-full max-w-[340px] mt-12 mb-0">
              <Form {...passwordForm}>
                <form onSubmit={(e) => void handlePasswordSubmit(onPasswordSubmit)(e)} noValidate>
                  <Stack tokens={{ childrenGap: 68 }}>
                    <EmailField control={passwordForm.control} name="email" variant="password" placeholder="ie; hohndoe@mail.com" />
                    <PasswordField
                      control={passwordForm.control}
                      name="password"
                      showPassword={showPassword}
                      onTogglePassword={() => setShowPassword(!showPassword)}
                      variant="password"
                      
                    />

                    <Stack className="mt-0">
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
                        variant="password"
                        disabled={passwordForm.formState.isSubmitting}
                        isLoading={passwordForm.formState.isSubmitting}
                        loadingText="Signing in…"
                      >
                        Log In
                      </SubmitButton>
                      <TermsOfServiceText variant="small" />
                    </Stack>
                  </Stack>
                </form>
              </Form>
            </Stack>
          </Stack>

          <ScholarshipFooter variant="password" />
        </Stack>
      </Stack>
    </>
  );
};

export default SignInPage;

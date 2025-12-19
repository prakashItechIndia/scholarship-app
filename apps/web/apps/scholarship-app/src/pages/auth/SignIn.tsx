import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Stack, Text, MessageBar, MessageBarType, mergeStyles } from '@fluentui/react';
import { secureTokenStorage } from '@shared/utils/secureTokenStorage';
import { preserveQueryParams, handleAuthRedirect } from '../../utils/redirect';
import { useAuth } from '../../contexts/AuthContext';
import { SEO } from '../../components/seo/SEO';
import { generateOrganizationSchema } from '../../utils/schema';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { SocialLoginButton } from '@/components/auth/SocialLoginButton';
import { AuthLayoutWrapper } from '@/components/auth/AuthLayoutWrapper';
import { ScholarshipFooter } from '@/components/auth/ScholarshipFooter';
import { LogoHeader } from '@/components/auth/LogoHeader';
import { EmailField } from '@/components/auth/EmailField';
import { PasswordField } from '@/components/auth/PasswordField';
import { getBaseUrl } from '../../utils/signInUtils';
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
      navigate('/verification');
    }
  };

  const onEmailSubmit = (values: EmailFormData) => {
    // For now, always redirect to verification for new users
    // TODO: Add API call to check if user exists, then decide between 'login' and 'check'
    verifyEmail(values.email, 'check');
  };

  const onPasswordSubmit = (values: SignInFormData) => {
    localStorage.setItem('scholarship_auth', JSON.stringify({
      email: values.email,
      password: values.password,
      cardcode: values.cardcode,
      rememberMe: values.rememberMe,
      timestamp: Date.now(),
    }));

    success('Sign In Successful', 'Redirecting to registration form...');
    setTimeout(() => void navigate('/registration'), 300);
  };



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
        <AuthLayoutWrapper footerVariant="email">
          <LogoHeader variant="email" />
          
          <Stack tokens={{ childrenGap: 8 }}>
            <Text variant="xxLarge" styles={{ root: { fontWeight: 700, color: '#111827', lineHeight: '1.25' } }}>
              Welcome to
            </Text>
            <Text variant="xxLarge" styles={{ root: { fontWeight: 700, color: '#111827', lineHeight: '1.25' } }}>
              Leo Muthu Scholarship
            </Text>
            <Text variant="small" styles={{ root: { color: '#4b5563', marginTop: '8px' } }}>
              Apply Online and Secure Your Educational Support
            </Text>
          </Stack>

          {passwordCreated && (
            <MessageBar messageBarType={MessageBarType.success}>
              Password created successfully! Please sign in with your credentials.
            </MessageBar>
          )}

          <Form {...emailForm}>
            <form onSubmit={(e) => void handleEmailSubmit(onEmailSubmit)(e)} noValidate>
              <Stack tokens={{ childrenGap: 24 }}>
                <EmailField control={emailForm.control} name="email" variant="email" />

                <Button
                  type="submit"
                  disabled={emailForm.formState.isSubmitting}
                  variant="primary"
                  styles={{
                    root: {
                      width: '100%',
                      height: '44px',
                      fontSize: '16px',
                      fontWeight: 600,
                    },
                  }}
                >
                  Continue
                </Button>

                <Text variant="small" styles={{ root: { color: '#4b5563', textAlign: 'center', lineHeight: '1.75' } }}>
                  By continuing, you agree to our{' '}
                  <span style={{ color: '#000000', textDecoration: 'none', fontWeight: 600 }}>
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span style={{ color: '#000000', textDecoration: 'none', fontWeight: 600 }}>
                    Privacy Policy
                  </span>
                  .
                </Text>
              </Stack>
            </form>
          </Form>

          {/* Social Login Section */}
          <Stack tokens={{ childrenGap: 16 }}>
            <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="center">
              <div style={{ flex: 1, height: '1px', backgroundColor: '#d1d5db' }}></div>
              <Text variant="small" styles={{ root: { color: '#6b7280' } }}>
                OR Continue with
              </Text>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#d1d5db' }}></div>
            </Stack>

            <Stack horizontal tokens={{ childrenGap: 12 }}>
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
        url="/signin"
        keywords="Leo Muthu Scholarship, LMS, ARAM Foundation, admin login"
        schema={organizationSchema}
      />
      <Stack
        horizontal
        className={mergeStyles({
          minHeight: '100vh',
          backgroundColor: '#0078D4',
        })}
      >
        {/* Left Panel - Login Image */}
        <Stack
          className={mergeStyles({
            display: 'none',
            width: '472px',
            position: 'relative',
            overflow: 'hidden',
            '@media (min-width: 1024px)': {
              display: 'flex',
            },
          })}
        >
          <Stack
            className={mergeStyles({
              width: '100%',
              height: '100%',
              position: 'relative',
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%), linear-gradient(193deg, rgba(0, 0, 0, 0) 33%, rgba(208, 231, 248, 1) 73%)',
              borderRadius: '40px',
              border: '4px solid #FFFFFF',
              margin: '20px',
            })}
          >
            <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { width: '100%', height: '100%' } }}>
              <Stack horizontalAlign="center" tokens={{ childrenGap: 16 }} styles={{ root: { color: '#ffffff', textAlign: 'center', padding: '32px' } }}>
                <PersonIcon style={{ width: '128px', height: '128px', margin: '0 auto 16px', opacity: 0.5 }} />
                <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
                  Login Image
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {/* Right Panel - Login Card */}
        <Stack
          grow
          className={mergeStyles({
            backgroundColor: '#ffffff',
            borderTopLeftRadius: '20px',
            borderBottomLeftRadius: '20px',
            boxShadow: '0px 0px 0px 0px rgba(0,0,0,0.01), 2px 2px 6px 0px rgba(0,0,0,0.01), 7px 9px 11px 0px rgba(0,0,0,0.01), 16px 20px 15px 0px rgba(0,0,0,0.01), 28px 36px 18px 0px rgba(0,0,0,0), 44px 56px 20px 0px rgba(0,0,0,0)',
          })}
        >
          <Stack
            grow
            horizontalAlign="center"
            className={mergeStyles({
              padding: '32px 24px',
              '@media (min-width: 640px)': { padding: '32px 48px' },
              '@media (min-width: 1024px)': { padding: '32px 64px' },
              '@media (min-width: 1280px)': { padding: '32px 96px' },
            })}
          >
            <LogoHeader variant="password" />

            <Stack tokens={{ childrenGap: 4 }} styles={{ root: { width: '100%', maxWidth: '340px', marginTop: '48px', marginBottom: 0 } }}>
              <Text variant="xLarge" styles={{ root: { color: '#242424', fontWeight: 600, fontFamily: 'Inter, sans-serif', lineHeight: '32px' } }}>
                Welcome to<br />Leo Muthu Scholarship
              </Text>
              <Text variant="small" styles={{ root: { color: '#707070', fontFamily: 'Inter, sans-serif', lineHeight: '16px' } }}>
                Log In to Administer and Monitor Scholarship Applications
              </Text>
            </Stack>

            <Stack styles={{ root: { width: '100%', maxWidth: '340px', marginTop: '48px', marginBottom: 0 } }}>
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

                    <Stack styles={{ root: { marginTop: 0 } }}>
                      <Link
                        to={preserveQueryParams('/forgot-password', ['returnUrl', 'product', 'state'])}
                        style={{
                          color: '#2453C3',
                          fontSize: '12px',
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: '16px',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.textDecoration = 'underline';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.textDecoration = 'none';
                        }}
                      >
                        Forgot your password?
                      </Link>
                    </Stack>

                    <Stack tokens={{ childrenGap: 8 }}>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={passwordForm.formState.isSubmitting}
                        styles={{
                          root: {
                            width: '100%',
                            borderRadius: '4px',
                            backgroundColor: '#2453C3',
                            padding: '6px 12px',
                            color: '#ffffff',
                            fontSize: '12px',
                            fontWeight: 600,
                            fontFamily: 'Inter, sans-serif',
                            lineHeight: '20px',
                            border: 'none',
                            ':hover': {
                              backgroundColor: '#1e42a0',
                            },
                            ':disabled': {
                              cursor: 'not-allowed',
                              backgroundColor: '#60a5fa',
                            },
                          },
                        }}
                      >
                        {passwordForm.formState.isSubmitting ? 'Signing in…' : 'Log In'}
                      </Button>
                      <Text variant="small" styles={{ root: { color: '#707070', fontSize: '10px', fontFamily: 'Inter, sans-serif', lineHeight: '16px' } }}>
                        By continuing, you agree to our{' '}
                        <a href="#" style={{ color: '#2453C3', fontSize: '10px', fontWeight: 500, fontFamily: 'Inter, sans-serif', textDecoration: 'underline', lineHeight: '16px' }}>
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" style={{ color: '#2453C3', fontSize: '10px', fontWeight: 500, fontFamily: 'Inter, sans-serif', textDecoration: 'underline', lineHeight: '16px' }}>
                          Privacy Policy
                        </a>
                        .
                      </Text>
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

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayoutWrapper } from '@/components/auth/AuthLayoutWrapper';
import { LogoHeader } from '@/components/auth/LogoHeader';
import { WelcomeText } from '@/components/auth/WelcomeText';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { TermsOfServiceText } from '@/components/auth/TermsOfServiceText';
import { EmailField } from '@/components/auth/EmailField';
import { scholarshipAuth } from '../../services/scholarship.service';
import { preserveQueryParams } from '../../utils/redirect';
import { SEO } from '../../components/seo/SEO';
import { Form } from '@shared/components';
import { Stack, Text } from '@fluentui/react';
import { useToast } from '@/components/ui/toast';
import { getBaseUrl } from '@/utils/signInUtils';
import { generateOrganizationSchema } from '../../utils/schema';
import adminLoginBanner from '@shared/assets/icons/adminLogin.png';

const schema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof schema>;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState('');
  const { success, error } = useToast();
  const [searchParams] = useSearchParams();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    getValues,
  } = form;

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

  const mutation = useMutation({
    mutationFn: (email: string) => scholarshipAuth.forgotPassword(email),
    onSuccess: (data) => {
      success(
        'Success',
        data.message || 'Password reset email sent successfully. Please check your inbox.',
      );
      setEmailSent(true);
      setEnteredEmail(getValues('email'));
    },
    onError: (err: Error) => {
      error(
        'Request Failed',
        err.message || 'Failed to send password reset email. Please try again.',
      );
    },
  });

  const onSubmit = (values: ForgotPasswordFormData) => {
    mutation.mutate(values.email);
  };

  const signInUrl = preserveQueryParams('/admin-login', [
    'returnUrl',
    'product',
    'state',
  ]);

  if (emailSent) {
    const emailParts = enteredEmail.split('@');
    const maskedEmail = emailParts.length === 2
      ? `${enteredEmail.substring(0, 2)}${'*'.repeat(Math.min(enteredEmail.length - 2, 5))}@${emailParts[1]}`
      : enteredEmail;

    return (
      <>
        <SEO
          title="Check Your Email"
          description="Password reset email sent. Please check your inbox and click the reset link to create a new password."
          url="/forgot-password"
          noindex={true}
          schema={organizationSchema}
        />
        <AuthLayoutWrapper footerVariant="email" bannerImage={adminLoginBanner}>
          <LogoHeader variant="email" />
          
          <WelcomeText 
            variant="email" 
            subtitle="If the email exists, a password reset link has been sent to your email address."
          />

          <div className="space-y-6">
            <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700 border border-blue-200">
              <strong>{maskedEmail}</strong>
            </div>
            <p className="text-sm text-Neutral-Foreground-2-Rest">
              Please check your inbox and click the reset link to create a new
              password. The link will expire in 24 hours.
            </p>
            <Link
              to={signInUrl}
              className="block w-full text-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-Neutral-Foreground-1-Rest  transition hover:bg-blue-700"
            >
              Back to Sign-in
            </Link>
          </div>
        </AuthLayoutWrapper>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Forgot Password - Admin"
        description="Reset your Leo Muthu Scholarship admin account password. Enter your email address and we'll send you a secure password reset link."
        url="/forgot-password"
        keywords="forgot password, password reset, recover account, admin password"
        noindex={true}
        schema={organizationSchema}
      />
      <AuthLayoutWrapper footerVariant="email" bannerImage={adminLoginBanner}>
        <LogoHeader variant="email" />
        
        <WelcomeText 
          variant="email" 
          subtitle="Enter your email address and we'll send you a link to reset your password."
        />

        <Form {...form}>
          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} noValidate>
            <Stack tokens={{ childrenGap: 24 }}>
              <EmailField 
                control={form.control} 
                name="email" 
                variant="password" 
                placeholder="Enter your email address"
              />

              <Stack tokens={{ childrenGap: 8 }}>
                <SubmitButton
                  type="submit"
                  disabled={form.formState.isSubmitting || mutation.status === 'pending'}
                  isLoading={form.formState.isSubmitting || mutation.status === 'pending'}
                  loadingText="Sending..."
                  variant="password"
                  className="h-11"
                >
                  Send me a reset link
                </SubmitButton>

                <TermsOfServiceText />
              </Stack>
            </Stack>
          </form>
        </Form>

        <Stack tokens={{ childrenGap: 8 }}>
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
                void navigate(signInUrl);
              }}
            >
              Back to Sign-in
            </Text>
          </Stack>
        </Stack>
      </AuthLayoutWrapper>
    </>
  );
};

export default ForgotPasswordPage;

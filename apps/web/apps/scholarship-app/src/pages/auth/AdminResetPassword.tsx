import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthLayoutWrapper } from '@/components/auth/AuthLayoutWrapper';
import { LogoHeader } from '@/components/auth/LogoHeader';
import { WelcomeText } from '@/components/auth/WelcomeText';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { TermsOfServiceText } from '@/components/auth/TermsOfServiceText';
import { PasswordField } from '@/components/auth/PasswordField';
import { scholarshipAuth } from '../../services/scholarship.service';
import { preserveQueryParams } from '../../utils/redirect';
import { SEO } from '../../components/seo/SEO';
import { Form } from '@shared/components';
import { Stack, Text } from '@fluentui/react';
import { useToast } from '@/components/ui/toast';
import { getBaseUrl } from '@/utils/signInUtils';
import { generateOrganizationSchema } from '../../utils/schema';
import adminLoginBanner from '@shared/assets/icons/adminLogin.png';

const schema = z
  .object({
    password: z
      .string()
      .default('')
      .refine((val) => val.length >= 8, {
        message: 'Password must be at least 8 characters long',
      }),
    confirmPassword: z.string().default(''),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof schema>;

const AdminResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { success, error } = useToast();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit } = form;

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
    mutationFn: ({
      email,
      token,
      newPassword,
    }: {
      email: string;
      token: string;
      newPassword: string;
    }) => scholarshipAuth.resetPassword(email, token, newPassword),
    onSuccess: () => {
      success('Success', 'Password reset successfully. Please log in with your new password.');
      const signInUrl = preserveQueryParams('/admin-login', [
        'returnUrl',
        'product',
        'state',
      ]);
      const separator = signInUrl.includes('?') ? '&' : '?';
      void navigate(`${signInUrl}${separator}passwordReset=success`);
    },
    onError: (err: Error) => {
      error('Reset Failed', err.message || 'Unable to reset password. Please try again.');
    },
  });

  useEffect(() => {
    if (!token || !email) {
      const signInUrl = preserveQueryParams('/admin-login', [
        'returnUrl',
        'product',
        'state',
      ]);
      const separator = signInUrl.includes('?') ? '&' : '?';
      void navigate(`${signInUrl}${separator}error=missing-token`);
    }
  }, [token, email, navigate]);

  const onSubmit = (values: ResetPasswordFormData) => {
    if (!token || !email) return;
    mutation.mutate({ email, token, newPassword: values.password });
  };

  return (
    <>
      <SEO
        title="Reset Password - Admin"
        description="Reset your Leo Muthu Scholarship admin account password. Enter your new password to complete the reset process."
        url="/admin-reset-password"
        keywords="reset password, password reset, admin password, Leo Muthu Scholarship"
        noindex={true}
        schema={organizationSchema}
      />
      <AuthLayoutWrapper footerVariant="email" bannerImage={adminLoginBanner}>
        <LogoHeader variant="email" />
        
        <WelcomeText 
          variant="email" 
          subtitle="Enter your new password to complete the reset process."
        />

        <Form {...form}>
          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} noValidate>
            <Stack tokens={{ childrenGap: 24 }}>
              <PasswordField
                control={form.control}
                name="password"
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                variant="password"
                placeholder="Enter your new password"
                hideprefixIcon={true}
              />
              <PasswordField
                control={form.control}
                name="confirmPassword"
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                variant="password"
                placeholder="Confirm your new password"
                hideprefixIcon={true}
              />

              <Stack tokens={{ childrenGap: 8 }}>
                <SubmitButton
                  type="submit"
                  disabled={form.formState.isSubmitting || mutation.status === 'pending'}
                  isLoading={form.formState.isSubmitting || mutation.status === 'pending'}
                  loadingText="Resetting..."
                  variant="password"
                  className="h-11"
                >
                  Reset Password
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
                void navigate(preserveQueryParams('/admin-login', [
                  'returnUrl',
                  'product',
                  'state',
                ]));
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

export default AdminResetPasswordPage;


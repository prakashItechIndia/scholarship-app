import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { requestPasswordReset } from '../../services/auth.service';
import { preserveQueryParams } from '../../utils/redirect';
import { SEO } from '../../components/seo/SEO';
import { Input } from '@shared/components';
import { PersonIcon } from '@/components/ui/icons';
import { Form, FormField, FormItem, FormControl, FormMessage, Label } from '@shared/components';
import { PrimaryButton } from '@fluentui/react';
import { useToast } from '@/components/ui/toast';

const schema = z.object({
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

type ForgotPasswordFormData = z.infer<typeof schema>;

const ForgotPasswordPage = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState('');
  const { success, error } = useToast();
  const [searchParams] = useSearchParams();
  const returnUrl =
    searchParams.get('redirect') ?? searchParams.get('returnUrl');
  const productCode = searchParams.get('product');

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    formState: { errors },
    getValues,
  } = form;

  const mutation = useMutation({
    mutationFn: (email: string) =>
      requestPasswordReset(email, returnUrl ?? undefined, productCode ?? undefined),
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

  const signInUrl = preserveQueryParams('/signin', [
    'returnUrl',
    'product',
    'state',
  ]);

  if (emailSent) {
    const maskedEmail = enteredEmail.replace(
      /(.{2})(.*)(@.*)/,
      (_: string, start: string, middle: string, end: string) => {
        const middleLength = typeof middle === 'string' ? middle.length : 0;
        return `${start}${'*'.repeat(Math.min(middleLength, 5))}${end}`;
      },
    );

    return (
      <>
        <SEO
          title="Check Your Email"
          description="Password reset email sent. Please check your inbox and click the reset link to create a new password."
          url="/forgot-password"
          noindex={true}
        />
        <AuthWrapper
          title="Check your email"
          subtitle="If the email exists, a password reset link has been sent to your email address."
        >
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
        </AuthWrapper>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Forgot Password"
        description="Reset your Leo Muthu Scholarship account password. Enter your email address and we'll send you a secure password reset link."
        url="/forgot-password"
        keywords="forgot password, password reset, recover account, Leo Muthu Scholarship password"
        noindex={true}
      />
      <AuthWrapper
        title="Forgot Password?"
        subtitle="Enter your email address and we'll send you a link to reset your password."
      >
        <Form {...form}>
          <form
            className="flex flex-col gap-[16px]"
            onSubmit={(e) => {
              void handleSubmit(onSubmit)(e);
            }}
            noValidate
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-[4px]">
                    <Label required className="text-[12px] font-normal text-Neutral-Foreground-1-Rest leading-[16px]">
                      Username
                    </Label>
                    <FormControl>
                      <Input
                        autoComplete='off'
                        {...field}
                        value={field.value ?? ''}
                        prefixIcon={<PersonIcon />}
                        type="email"
                        placeholder="Email address"
                        aria-invalid={Boolean(errors.email)}
                        required={false}
                      />
                    </FormControl>
                    <FormMessage className="text-Status-Danger-Foreground-1-Rest text-xs" />
                  </div>
                </FormItem>
              )}
            />


            <PrimaryButton
              type="submit"
              disabled={mutation.status === 'pending'}
            >
              {mutation.status === 'pending'
                ? 'Sending...'
                : 'Send me a reset link'}
            </PrimaryButton>
          </form>
        </Form>

        <div className="flex flex-col gap-2">
          <p className="text-[12px] text-Neutral-Foreground-2-Rest leading-[20px]">
            <Link
              to={signInUrl}
              className="text-[12px] font-medium text-Neutral-Foreground-2-Rest underline decoration-solid underline-offset-0 leading-[20px]"
            >
              Back to Sign-in
            </Link>
          </p>
        </div>
      </AuthWrapper>
    </>
  );
};

export default ForgotPasswordPage;

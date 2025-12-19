import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { resetPassword } from '../../services/auth.service';
import { preserveQueryParams } from '../../utils/redirect';
import { SEO } from '../../components/seo/SEO';
import { Input } from '@/components/ui/input';
import { KeyIcon, EyeIcon, EyeOffIcon } from '@/components/ui/icons';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/toast';

const schema = z
  .object({
    password: z
      .string()
      .default('')
      .refine((val) => val.length >= 12, {
        message: 'Password must be at least 12 characters long',
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must contain at least one uppercase letter (A-Z)',
      })
      .refine((val) => /[a-z]/.test(val), {
        message: 'Password must contain at least one lowercase letter (a-z)',
      })
      .refine((val) => /[0-9]/.test(val), {
        message: 'Password must contain at least one number (0-9)',
      })
      .refine((val) => /[!@#$%^&*]/.test(val), {
        message: 'Password must contain at least one special character (!@#$%^&*)',
      }),
    confirmPassword: z.string().default(''),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof schema>;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { success, error } = useToast();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange', // Trigger validation on every change
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const mutation = useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => resetPassword(token, newPassword),
    onSuccess: () => {
      success('Success', 'Password reset successfully. Please sign in with your new password.');
      // After password reset, redirect to sign-in which will then redirect back to product
      const signInUrl = preserveQueryParams('/signin', [
        'returnUrl',
        'product',
        'state',
      ]);
      // Properly append passwordReset parameter
      const separator = signInUrl.includes('?') ? '&' : '?';
      void navigate(`${signInUrl}${separator}passwordReset=success`);
    },
    onError: (err: Error) => {
      error('Reset Failed', err.message || 'Unable to reset password. Please try again.');
    },
  });

  useEffect(() => {
    if (!token) {
      const signInUrl = preserveQueryParams('/signin', [
        'returnUrl',
        'product',
        'state',
      ]);
      // Properly append error parameter
      const separator = signInUrl.includes('?') ? '&' : '?';
      void navigate(`${signInUrl}${separator}error=missing-token`);
    }
  }, [token, navigate]);

  const onSubmit = (values: ResetPasswordFormData) => {
    if (!token) return;
    mutation.mutate({ token, newPassword: values.password });
  };

  return (
    <>
      <SEO
        title="Reset Password"
        description="Create a secure password for your iCaptur account. Password must be at least 12 characters with uppercase, lowercase, number, and special character."
        url="/reset-password"
        keywords="reset password, change password, secure password, iCaptur password"
        noindex={true}
      />
      <AuthWrapper
        title="Reset Password"
        subtitle="Create a secure password with at least 12 characters, including uppercase, lowercase, number, and special character (!@#$%^&*)."
      >
        <div className="flex flex-col gap-[24px]">
          <Form {...form}>
            <form
              className="flex flex-col gap-[16px]"
              onSubmit={(e) => {
                void form.handleSubmit(onSubmit)(e);
              }}
              noValidate
            >
              {/* New Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-[4px]">
                      <label className="text-[12px] font-normal text-Neutral-Foreground-1-Rest leading-[16px] flex items-end gap-[4px]">
                        <span>New Password</span>
                        <span className="text-[12px] text-Status-Danger-Foreground-1-Rest">*</span>
                      </label>
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
                            >
                              {showPassword ? (
                                <EyeIcon className="w-4 h-4" />

                              ) : (
                                <EyeOffIcon className="w-4 h-4" />

                              )}
                            </button>
                          }
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your new password"
                          autoComplete="new-password"
                          aria-invalid={Boolean(form.formState.errors.password)}
                          className="bg-white"
                          required={false}
                        />
                      </FormControl>
                      <FormMessage className="text-Status-Danger-Foreground-1-Rest text-xs" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-[4px]">
                      <label className="text-[12px] font-normal text-Neutral-Foreground-1-Rest leading-[16px] flex items-end gap-[4px]">
                        <span>Confirm Password</span>
                        <span className="text-[12px] text-[#b10e1c]">*</span>
                      </label>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          prefixIcon={<KeyIcon />}
                          suffixIcon={
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="text-Neutral-Foreground-2-Rest hover:text-Neutral-Foreground-1-Rest flex items-center justify-center"
                            >
                              {showConfirmPassword ? (
                                <EyeIcon className="w-4 h-4" />
                              ) : (
                                <EyeOffIcon className="w-4 h-4" />
                              )}
                            </button>
                          }
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your new password"
                          autoComplete="new-password"
                          aria-invalid={Boolean(
                            form.formState.errors.confirmPassword,
                          )}
                          className="bg-white"
                          required={false}
                        />
                      </FormControl>
                      <FormMessage className="text-Status-Danger-Foreground-1-Rest text-xs" />
                    </div>
                  </FormItem>
                )}
              />


              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                disabled={mutation.status === 'pending' || !token}
              >
                {mutation.status === 'pending' ? 'Resetting...' : 'Reset Password'}
              </button>

              <Link
                to={preserveQueryParams('/signin', [
                  'returnUrl',
                  'product',
                  'state',
                ])}
                className="block text-center text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Back to Sign-in
              </Link>
            </form>
          </Form>
        </div>
      </AuthWrapper>
    </>
  );
};

export default ResetPasswordPage;

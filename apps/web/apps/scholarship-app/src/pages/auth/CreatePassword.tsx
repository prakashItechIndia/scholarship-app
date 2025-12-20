import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import {
  createPassword,
  validateActivationToken,
} from '../../services/auth.service';
import { preserveQueryParams } from '../../utils/redirect';
import { SEO } from '../../components/seo/SEO';
import { IconButton } from '@fluentui/react';
import { Input, Label } from '@shared/components';
import { KeyIcon, EyeIcon, EyeOffIcon } from '@/components/ui/icons';
import { Form, FormField, FormItem, FormControl, FormMessage, Label } from '@shared/components';
import { useToast } from '@/components/ui/toast';

const schema = z
  .object({
    password: z
      .string()
      .default('')
      .refine((val) => val.length >= 8, {
        message: 'Password must be at least 8 characters long',
      })
      .refine((val) => val.length <= 16, {
        message: 'Password cannot exceed 16 characters',
      })
      .refine((val) => /[a-zA-Z]/.test(val), {
        message: 'Password must contain at least one letter (a-z, A-Z)',
      })
      .refine((val) => /[0-9]/.test(val), {
        message: 'Password must contain at least one number (0-9)',
      }),
    confirmPassword: z.string().default(''),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type CreatePasswordFormData = z.infer<typeof schema>;

const CreatePasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [validating, setValidating] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { success, error } = useToast();

  const form = useForm<CreatePasswordFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange', // Trigger validation on every change
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setTokenError('Activation token is missing');
        setValidating(false);
        return;
      }

      try {
        const result = await validateActivationToken(token);
        if (result.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setTokenError('Invalid activation token');
        }
      } catch {
        setTokenValid(false);
        setTokenError('Invalid or expired activation token');
      } finally {
        setValidating(false);
      }
    };

    void validateToken();
  }, [token]);

  const mutation = useMutation({
    mutationFn: (password: string) => {
      if (!token) throw new Error('Token is missing');
      return createPassword({ token, password });
    },
    onSuccess: () => {
      success('Success', 'Password created successfully. Your account is now activated.');
      const accountActivatedUrl = preserveQueryParams('/account-activated', [
        'returnUrl',
        'product',
        'state',
      ]);
      void navigate(accountActivatedUrl);
    },
    onError: (err: Error) => {
      error(
        'Create Failed',
        err.message || 'Unable to create password. Please try again.',
      );
    },
  });

  const onSubmit = (values: CreatePasswordFormData) => {
    mutation.mutate(values.password);
  };

  // const passwordValue = form.watch("password");

  if (validating) {
    return (
      <AuthWrapper title="Validating activation token...">
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </AuthWrapper>
    );
  }

  if (!tokenValid) {
    return (
      <AuthWrapper
        title="Invalid Token"
        subtitle={
          tokenError ?? 'The activation token is invalid or has expired.'
        }
      >
        <div className="space-y-6">
          <p className="text-sm text-Neutral-Foreground-2-Rest">
            Please check your email for a new activation link, or contact
            support if you continue to experience issues.
          </p>
          <button
            onClick={() => {
              const signInUrl = preserveQueryParams('/signin', [
                'returnUrl',
                'product',
                'state',
              ]);
              void navigate(signInUrl);
            }}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Go to Sign-in
          </button>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <>
      <SEO
        title="Create Password"
        description="Create a secure password for your Leo Muthu Scholarship account. Password must be 8-16 characters with at least one letter and one number."
        url="/create-password"
        keywords="create password, account setup, secure password, Leo Muthu Scholarship account"
        noindex={true}
      />
      <AuthWrapper
        title="Create Your Password"
        subtitle="Create a secure password (8-16 characters) with at least one letter (a-z, A-Z) and one number (0-9). Special characters are allowed but not required."
      >
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
                    <Label required className="text-[12px] font-normal text-Neutral-Foreground-1-Rest leading-[16px]">
                      New Password
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        prefixIcon={<KeyIcon />}
                        suffixIcon={
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            ariaLabel={showPassword ? 'Hide password' : 'Show password'}
                            onRenderIcon={() => 
                              showPassword ? (
                                <EyeOffIcon className="w-4 h-4 text-Neutral-Foreground-2-Rest hover:text-Neutral-Foreground-1-Rest" />
                              ) : (
                                <EyeIcon className="w-4 h-4 text-Neutral-Foreground-2-Rest hover:text-Neutral-Foreground-1-Rest" />
                              )
                            }
                            className="w-auto h-auto min-w-0 p-1 bg-transparent border-none hover:bg-transparent active:bg-transparent"
                          />
                        }
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        autoComplete="new-password"
                        aria-invalid={Boolean(form.formState.errors.password)}
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
                    <Label required className="text-[12px] font-normal text-Neutral-Foreground-1-Rest leading-[16px]">
                      Confirm Password
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        prefixIcon={<KeyIcon />}
                        suffixIcon={
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            ariaLabel={showConfirmPassword ? 'Hide password' : 'Show password'}
                            onRenderIcon={() => 
                              showConfirmPassword ? (
                                <EyeIcon className="w-4 h-4 text-Neutral-Foreground-2-Rest hover:text-Neutral-Foreground-1-Rest" />
                              ) : (
                                <EyeOffIcon className="w-4 h-4 text-Neutral-Foreground-2-Rest hover:text-Neutral-Foreground-1-Rest" />
                              )
                            }
                            className="w-auto h-auto min-w-0 p-1 bg-transparent border-none hover:bg-transparent active:bg-transparent"
                          />
                        }
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        aria-invalid={Boolean(
                          form.formState.errors.confirmPassword,
                        )}
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
              disabled={mutation.status === 'pending'}
            >
              {mutation.status === 'pending'
                ? 'Creating Password...'
                : 'Create Password'}
            </button>
          </form>
        </Form>
      </AuthWrapper>
    </>
  );
};

export default CreatePasswordPage;

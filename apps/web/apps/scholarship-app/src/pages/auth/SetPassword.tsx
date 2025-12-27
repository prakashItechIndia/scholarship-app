// @ts-nocheck - Type inference issues between zodResolver, FormField component, and react-hook-form
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stack, IconButton } from '@fluentui/react';
import { SEO } from '../../components/seo/SEO';
import { generateOrganizationSchema } from '../../utils/schema';
import { AuthLayoutWrapper } from '@/components/auth/AuthLayoutWrapper';
import { LogoHeaderWithOffset } from '@/components/auth/LogoHeaderWithOffset';
import { AuthPageHeader } from '@/components/auth/AuthPageHeader';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { TermsOfServiceText } from '@/components/auth/TermsOfServiceText';
import { FormField, FormItem, FormControl, FormMessage, Input, Label } from '@shared/components';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icons';
import { getBaseUrl } from '@/utils/signInUtils';
import { useToast } from '@/components/ui/toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

const passwordSchema = z
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
    message: "Passwords do not match. Please re-enter.", // BRD Section 5.2.4
    path: ['confirmPassword'],
  });

type SetPasswordFormData = z.infer<typeof passwordSchema>;

const SetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState<string>('');
  const { success, error: showError } = useToast();

  useEffect(() => {
    // Get email from URL params, then localStorage as fallback
    const emailFromUrl = searchParams.get('email');
    const storedEmail = localStorage.getItem('verification_email');
    const token = searchParams.get('token') || localStorage.getItem('verification_token');
    
    // Priority: URL param > localStorage
    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl));
      // Also store in localStorage for consistency
      localStorage.setItem('verification_email', decodeURIComponent(emailFromUrl));
    } else if (storedEmail) {
      setEmail(storedEmail);
    }

    // If no token and no email, redirect to login
    if (!token && !emailFromUrl && !storedEmail) {
      void navigate('/user-login');
    }
  }, [searchParams, navigate]);

  const form = useForm<SetPasswordFormData>({
    resolver: zodResolver(passwordSchema),
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

  const onSubmit = async (values: SetPasswordFormData) => {
    try {
      if (!email) {
        showError('Error', 'Email address is required. Please go back to login.');
        return;
      }

      // Get verification token from URL or localStorage
      const token = searchParams.get('token') || localStorage.getItem('verification_token') || undefined;

      // Call API to set password
      const { scholarshipApplication } = await import('../../services/scholarship.service');
      const result = await scholarshipApplication.setNewPassword(email, values.password, token);

      if (result.success) {
        success('Success', result.message || 'Password set successfully! Please log in with your email and password.');
        
        // Clear verification token
        localStorage.removeItem('verification_token');
        localStorage.removeItem('verification_email');
        
        // Redirect to login page - user needs to enter email and password
        setTimeout(() => {
          void navigate('/user-login');
        }, 1000);
      } else {
        showError('Error', result.message || 'Failed to set password. Please try again.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set password. Please try again.';
      showError('Error', errorMessage);
    }
  };

  return (
    <>
      <SEO
        title="Set Password - Leo Muthu Scholarship"
        description="Set your password to enhance account security for Leo Muthu Scholarship."
        url="/set-password"
        noindex={true}
        schema={organizationSchema}
      />
      <AuthLayoutWrapper footerVariant="email">
        <LogoHeaderWithOffset variant="email" />
        
        <AuthPageHeader
          title="Set Password"
          subtitle="Set your password to enhance account security."
          titleSize="xxLarge"
          subtitleSize="medium"
        />

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <form onSubmit={handleSubmit(onSubmit as any)} noValidate>
            <Stack tokens={{ childrenGap: 24 }}>
              {/* New Password Field */}
              <FormField
                control={form.control as any}
                name="password"
                render={({ field }: { field: any }) => (
                    <FormItem>
                      <div className="flex flex-col gap-[4px]">
                        <div className="required-label-wrapper">
                          <Label 
                            required 
                            // className="text-[12px] text-[#242424] leading-[16px] font-inter [&>*:not([aria-label*='Required'])]:text-[#242424]"
                          >
                            New Password
                          </Label>
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            suffixIcon={
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                ariaLabel={showPassword ? 'Hide password' : 'Show password'}
                                onRenderIcon={() => 
                                  showPassword ? (
                                    <EyeIcon className="w-4 h-8 !text-[#272727]" />
                                  ) : (
                                    <EyeOffIcon className="w-4 h-4 !text-[#272727]" />
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
                  control={form.control as any}
                  name="confirmPassword"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <div className="flex flex-col gap-[4px]">
                        <div className="required-label-wrapper">
                          <Label 
                            required 
                            className="text-[12px] text-[#242424] leading-[16px] [&>*:not([aria-label*='Required'])]:text-[#242424]"
                          >
                            Confirm Password
                          </Label>
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            suffixIcon={
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                ariaLabel={showConfirmPassword ? 'Hide password' : 'Show password'}
                                onRenderIcon={() => 
                                  showConfirmPassword ? (
                                    <EyeIcon className="w-4 h-4 !text-[#272727]" />
                                  ) : (
                                    <EyeOffIcon className="w-4 h-4 !text-[#272727]" />
                                  )
                                }
                                className="w-auto h-auto min-w-0 p-1 bg-transparent border-none hover:bg-transparent active:bg-transparent"
                              />
                            }
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            aria-invalid={Boolean(form.formState.errors.confirmPassword)}
                            required={false}
                          />
                        </FormControl>
                        <FormMessage className="text-Status-Danger-Foreground-1-Rest text-xs" />
                      </div>
                    </FormItem>
                  )}
                />
                <Stack tokens={{ childrenGap: 8 }}>
                <SubmitButton
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  isLoading={form.formState.isSubmitting}
                  loadingText="Loading..."
                >
                  Continue
                </SubmitButton>

              <TermsOfServiceText />
            </Stack>
          </Stack>
        </form>
      </AuthLayoutWrapper>
    </>
  );
};

export default SetPasswordPage;


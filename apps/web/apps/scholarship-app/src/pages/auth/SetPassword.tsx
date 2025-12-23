import { useState } from 'react';
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
import { Form, FormField, FormItem, FormControl, FormMessage, Input, Label } from '@shared/components';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icons';
import { getBaseUrl } from '@/utils/signInUtils';
import { useToast } from '@/components/ui/toast';
import { useNavigate } from 'react-router-dom';

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
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SetPasswordFormData = z.infer<typeof passwordSchema>;

const SetPasswordPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { success } = useToast();

  const form = useForm<SetPasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

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

  const onSubmit = async (_values: SetPasswordFormData) => {
    // TODO: Implement password setting logic
    // Show loading for a few seconds before showing success
    await new Promise(resolve => setTimeout(resolve, 2000));
    success('Success', 'Password set successfully!');
    setTimeout(() => void navigate('/user-login'), 1000);
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

          <Form {...form}>
            <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} noValidate>
              <Stack tokens={{ childrenGap: 24 }}>
                {/* New Password Field */}
                <FormField
                  control={form.control}
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
                  control={form.control}
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
          </Form>
      </AuthLayoutWrapper>
    </>
  );
};

export default SetPasswordPage;

